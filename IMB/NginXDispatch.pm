package IMB::NginXDispatch;

use strict;
use warnings;
use autodie qw(open);
use utf8;

use Hash::Util qw(lock_hash);
use IO::Handle;
use FCGI;
use POSIX;
use IMB::MySQL qw(connect_to_mysql);
use CGI::Simple;
use JSON qw(from_json to_json);
use FCGI::ProcManager qw(pm_manage pm_pre_dispatch pm_post_dispatch);
use Carp::Always;
use Encode;

use base 'Exporter';
our @EXPORT_OK = qw(start_dispatch);


sub process_request {
	my $dbh = shift;

	my $answer = eval {
		my $cgi = new CGI::Simple;
		my $data = from_json($cgi->param('json'), { utf8  => 1 });

		lock_hash(%$data);

		require 'IMB/Workers/' . $data->{'module'} . '.pm';
		my $worker = ('IMB::Workers::' . $data->{'module'})->new($dbh);

		return {
			'data' => $worker->respond($data),
			'status' => 1,
		};
	};

	if ($@) {
		$answer = {'status' => 0, 'error' => $@};
	}

	print "Content-Type: application/json;charset=UTF-8\r\n\r\n";

	print to_json($answer, { utf8  => 1 });
}


sub start_dispatch {
	fork && exit 0;

	my $socket = FCGI::OpenSocket(":9000", 5);
	my $request = FCGI::Request(\*STDIN, \*STDOUT, \*STDERR, \%ENV, $socket);

	pm_manage(n_processes => 2);


	my $dbh = connect_to_mysql("imbdb");

	reopen_std();

	my $count = 1;

	open(my $fh, ">>/root/imb.log");

	$fh->autoflush();

	while($request->Accept() >= 0) {
		pm_pre_dispatch();
		process_request($dbh);
		pm_post_dispatch();
	}
	close($fh);
}


sub reopen_std {
	open(STDIN,  "+>>/root/imb.log") or die "Can't open STDIN: $!";
	open(STDOUT, "+>&STDIN") or die "Can't open STDOUT: $!";
	open(STDERR, "+>&STDIN") or die "Can't open STDERR: $!";
};

1;

