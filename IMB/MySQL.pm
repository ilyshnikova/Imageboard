package IMB::MySQL;

use utf8;
use strict;
use warnings;

use DBI;

use base 'Exporter';
our @EXPORT_OK = qw(connect_to_mysql);

sub connect_to_mysql {
	my $database_name = shift;

	my $dbh = DBI->connect("DBI:mysql::localhost", "root", "", {'RaiseError' => 1, 'mysql_enable_utf8' => 1});
	$dbh->do("use $database_name");
	$dbh->{'mysql_enable_utf8'} = 1;
	$dbh->do("set names 'utf8'");

	return $dbh;

}

1;

