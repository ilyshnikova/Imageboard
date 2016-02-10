#!/usr/bin/perl

use strict;
use warnings;
use FCGI;
use POSIX;

use FCGI::ProcManager qw(pm_manage pm_pre_dispatch pm_post_dispatch);

fork && exit 0;

POSIX::setsid()
or die "Can't set sid: $!";

chdir '/'
or die "Can't chdir: $!";

POSIX::setuid(65534)
or die "Can't set uid: $!";

my $socket = FCGI::OpenSocket(":9000", 5);
my $request = FCGI::Request(\*STDIN, \*STDOUT, \*STDERR, \%ENV, $socket);

pm_manage(n_processes => 2);

# {
# Some code reated with mysql
# }

reopen_std();

my $count = 1;

while($request->Accept() >= 0) {
	pm_pre_dispatch();

	print "Content-Type: text/plain\r\n\r\n";
	print "$$: ".$count++;

	pm_post_dispatch();
};


sub reopen_std {
	open(STDIN,  "+>/dev/null") or die "Can't open STDIN: $!";
	open(STDOUT, "+>&STDIN") or die "Can't open STDOUT: $!";
	open(STDERR, "+>&STDIN") or die "Can't open STDERR: $!";
};

