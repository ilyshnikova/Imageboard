#package IMB::NginXDispatch
#!/usr/bin/perl

use strict;
use warnings;
use autodie qw(open);

use IO::Handle;
use FCGI;
use POSIX;
use IMB::MySQL qw(connect_to_mysql);
use CGI::Simple;

use FCGI::ProcManager qw(pm_manage pm_pre_dispatch pm_post_dispatch);

sub start_dispatch {

	fork && exit 0;

	POSIX::setsid()
	or die "Can't set sid: $!";

	chdir '/'
	or die "Can't chdir: $!";

	my $socket = FCGI::OpenSocket(":9000", 5);
	my $request = FCGI::Request(\*STDIN, \*STDOUT, \*STDERR, \%ENV, $socket);

	pm_manage(n_processes => 1);


	my $dbh = connect_to_mysql("imbdb");

	reopen_std();

	my $count = 1;

	open(my $fh, ">>/root/imb.log");

	$fh->autoflush();

	while($request->Accept() >= 0) {
		pm_pre_dispatch();

		print "Content-Type: text/plain\r\n\r\n";
		print "$$: ".$count++;

		my $cgi = new CGI::Simple;
		my $module = $cgi->param('action');
		print $fh "lalalaalla = $module\n";

		pm_post_dispatch();
	}
	close($fh);
}


sub reopen_std {
	open(STDIN,  "+>>/dev/null") or die "Can't open STDIN: $!";
	open(STDOUT, "+>&STDIN") or die "Can't open STDOUT: $!";
	open(STDERR, "+>&STDIN") or die "Can't open STDERR: $!";
};

start_dispatch();
