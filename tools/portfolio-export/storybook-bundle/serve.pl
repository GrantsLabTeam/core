#!/usr/bin/perl
# Minimal static file server for the Storybook build. Uses only core Perl,
# which ships with macOS and most Linux distributions.
# Usage: perl serve.pl <directory> <port>
use strict;
use warnings;
use IO::Socket::INET;
use File::Spec;

my ($root, $port) = @ARGV;
die "usage: perl serve.pl <directory> <port>\n" unless defined $root && defined $port;
$root = File::Spec->rel2abs($root);

my %mime = (
    html  => 'text/html; charset=utf-8',
    js    => 'text/javascript; charset=utf-8',
    mjs   => 'text/javascript; charset=utf-8',
    css   => 'text/css; charset=utf-8',
    json  => 'application/json; charset=utf-8',
    svg   => 'image/svg+xml',
    png   => 'image/png',
    jpg   => 'image/jpeg',
    jpeg  => 'image/jpeg',
    gif   => 'image/gif',
    webp  => 'image/webp',
    ico   => 'image/x-icon',
    woff  => 'font/woff',
    woff2 => 'font/woff2',
    txt   => 'text/plain; charset=utf-8',
    map   => 'application/json; charset=utf-8',
);

my $server = IO::Socket::INET->new(
    LocalAddr => '127.0.0.1',
    LocalPort => $port,
    Proto     => 'tcp',
    Listen    => 64,
    ReuseAddr => 1,
) or die "Could not listen on port $port: $!\n";

$SIG{CHLD} = 'IGNORE';    # auto-reap one child process per connection
$| = 1;
print "Serving $root on http://127.0.0.1:$port\n";

while (my $client = $server->accept) {
    my $pid = fork;
    if (!defined $pid) { close $client; next; }
    if ($pid) { close $client; next; }
    close $server;
    handle($client);
    exit 0;
}

sub respond {
    my ($client, $status, $type, $body, $head_only) = @_;
    print $client "HTTP/1.1 $status\r\n",
        "Content-Type: $type\r\n",
        "Content-Length: ", length($body), "\r\n",
        "Cache-Control: no-cache\r\n",
        "Connection: close\r\n\r\n";
    print $client $body unless $head_only;
}

sub handle {
    my ($client) = @_;
    binmode $client;
    my $request = <$client>;
    return unless defined $request;
    while (my $line = <$client>) { last if $line =~ /^\r?\n$/; }

    my ($method, $target) = $request =~ m{^(GET|HEAD) (\S+)};
    return respond($client, '405 Method Not Allowed', 'text/plain', "Method not allowed\n")
        unless $method;
    my $head_only = $method eq 'HEAD';

    (my $path = $target) =~ s/[?#].*//;
    $path =~ s/%([0-9A-Fa-f]{2})/chr(hex($1))/ge;
    $path .= 'index.html' if $path =~ m{/$};
    return respond($client, '403 Forbidden', 'text/plain', "Forbidden\n", $head_only)
        if $path =~ m{(^|/)\.\.(/|$)};

    my $file = File::Spec->catfile($root, split m{/}, $path);
    return respond($client, '404 Not Found', 'text/plain', "Not found\n", $head_only)
        unless -f $file && open(my $fh, '<:raw', $file);
    local $/;
    my $body = <$fh>;
    close $fh;
    my ($ext) = $file =~ /\.([^.\/]+)$/;
    respond($client, '200 OK', $mime{lc($ext // '')} // 'application/octet-stream', $body,
        $head_only);
}
