CREATE TABLE survey (
PersonID int auto_increment,
Firstname varchar(50),
Phonenumber varchar(11),
Locality varchar(255),
Age int,
latitude DECIMAL(9,6),
longitude DECIMAL(9,6),
primary key (PersonID)
);