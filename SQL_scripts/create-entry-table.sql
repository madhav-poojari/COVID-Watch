CREATE TABLE Entry (
    EntryID int NOT NULL,    
    PersonID int,
    Entrydate date,
    latitude DECIMAL(9,6),
	longitude DECIMAL(9,6),
    PRIMARY KEY (EntryID),
    FOREIGN KEY (PersonID) REFERENCES survey(PersonID)
);