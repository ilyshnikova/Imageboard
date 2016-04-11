package IMB::Workers::Board;

use strict;
use warnings;
use utf8;

use base 'IMB::WorkerBase';


sub get_boards_names {
	my $self = shift;

	return $self->{'dbh'}->selectall_arrayref("
		select
			Id,
			convert(Name using utf8) as Name,
			convert(Title using utf8) as Title
		from
			Boards
	", {Slice => {}});
}

sub add_new_board {
	my $self = shift;
	my $data = shift;

	my ($name, $title) = map {$data->{$_}} 'name', 'title';


	$self->{'dbh'}->do("
		lock table
			Boards
		write
	");

	my ($max_id) = $self->{'dbh'}->selectrow_array("
		select
			ifnull(max(Id), 0)
		from
			Boards
	");

	my $new_id = $max_id + 1;

	$self->{'dbh'}->do("
		insert into
			Boards(Id, Name, Title)
		values
			(
				$new_id, " . $self->{'dbh'}->quote($name) . ", " .  $self->{'dbh'}->quote($title) . "
			)
	");

	$self->{'dbh'}->do("
		unlock tables
	");

	return $new_id;
}

sub respond {
	my $self = shift;
	my $data = shift;

	if ($data->{'type'} eq 'get_names') {
		return  $self->get_boards_names();
	} elsif ($data->{'type'} eq 'add') {
		return $self->add_new_board($data);
	} else {
		die "integrity type";
	}
}

1;
