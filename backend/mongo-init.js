db = db.getSiblingDB('theSocialNetworkAppAccount');
db.createUser(
    {
        user: 'theSocialNetworkAppAdmin',
        pwd:  'njdqsndnqldz',
        roles: [{role: 'readWrite', db: 'theSocialNetworkAppAccount'}],
    }
);

db = db.getSiblingDB('theSocialNetworkAppReports');
db.createUser(
    {
        user: 'theSocialNetworkAppAdmin',
        pwd:  'njdqsndnqldz',
        roles: [{role: 'readWrite', db: 'theSocialNetworkAppReports'}],
    }
);

db = db.getSiblingDB('theSocialNetworkAppImage');
db.createUser(
    {
        user: 'theSocialNetworkAppAdmin',
        pwd:  'njdqsndnqldz',
        roles: [{role: 'readWrite', db: 'theSocialNetworkAppImage'}],
    }
);

db = db.getSiblingDB('theSocialNetworkAppAuth');
db.createUser(
    {
        user: 'theSocialNetworkAppAdmin',
        pwd:  'njdqsndnqldz',
        roles: [{role: 'readWrite', db: 'theSocialNetworkAppAuth'}],
    }
);