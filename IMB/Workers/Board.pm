package IMB::Workers::Board;

use strict;
use warnings;
use utf8;

use base 'IMB::WorkerBase';
use IMB::UploadFile;


sub get_boards_names {
	my $self = shift;

	return $self->{'dbh'}->selectall_arrayref("
		select
			Id,
			convert(Name using utf8) as Name,
			convert(Title using utf8) as Title,
			Image
		from
			Boards
	", {Slice => {}});
}

sub add_new_board {
	my $self = shift;
	my $data = shift;

	my ($name, $title) = map {$data->{$_}} 'name', 'title';

	my $image = 0;

	if ($data->{'files'}->[0]) {
		$image = 1;
	}

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
			Boards(Id, Name, Title, Image)
		values
			(
				$new_id, " . $self->{'dbh'}->quote($name) . ", " .  $self->{'dbh'}->quote($title) . ", $image
			)
	");

	if ($image) {
		IMB::UploadFile::upload_file(
			$data->{'files'}->[0]->{'fh'},
			"/var/www/imageboard/public/boards_images/" . $new_id . ".png"
		);
	}


	$self->{'dbh'}->do("
		unlock tables
	");

	return {"Id" => $new_id, "Image" => $image};
}


sub delete_board {
	my $self = shift;
	my $data = shift;

	my ($board_id, $user_hash) = map {$data->{$_}} 'board_id', 'user_hash';

	if ($self->get_user_datails($user_hash)->{'Mode'}) {
		$self->{'dbh'}->do("
			lock table
				Boards write
		");

		$self->{'dbh'}->do("
			delete from
				Boards
			where
				Id=" . $board_id  . "
		");
		`rm /var/www/imageboard/public/boards_images/$board_id.png`;

		$self->{'dbh'}->do("
			unlock tables
		");
	}

	return {};
}


sub respond {
	my $self = shift;
	my $data = shift;

	if ($data->{'type'} eq 'get_names') {
		return  $self->get_boards_names();
	} elsif ($data->{'type'} eq 'add') {
		return $self->add_new_board($data);
	} elsif ($data->{'type'} eq 'delete') {
		return $self->delete_board($data);
	} else {
		die "integrity type";
	}
}

1;
