CREATE TABLE IF NOT EXISTS admins (
    adminId INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255),
    phone VARCHAR(15),
    role VARCHAR(50),
    password VARCHAR(255),
    activeStatus BOOLEAN,
    createdDateTime DATETIME,
    otp INT,
    otpCreatedDateTime DATETIME,
    otpExpiry DATETIME
);

CREATE TABLE IF NOT EXISTS adminProfiles (
    adminProfileId INT PRIMARY KEY AUTO_INCREMENT,
    adminId INT,
    firstname VARCHAR(100),
    middlename VARCHAR(100),
    lastname VARCHAR(100),
    imageUrl VARCHAR(255),
    FOREIGN KEY (adminId) REFERENCES admins(adminId)
);

CREATE TABLE IF NOT EXISTS healthStations (
    healthStationId INT PRIMARY KEY AUTO_INCREMENT,
    registerdBy INT,
    name VARCHAR(255),
    type VARCHAR(100),
    city VARCHAR(100),
    subcity VARCHAR(100),
    kebele VARCHAR(100),
    houseNumber VARCHAR(100),
    createdDateTime DATETIME,
    FOREIGN KEY (registerdBy) REFERENCES admins(adminId)
);

CREATE TABLE IF NOT EXISTS healthStationInfos (
    healthStationInfoId INT PRIMARY KEY AUTO_INCREMENT,
    healthStationId INT,
    serviceAm TEXT,
    serviceOr TEXT,
    descriptionAm TEXT,
    descriptionOr TEXT,
    createdDateTime DATETIME,
    registerdBy INT,
    FOREIGN KEY (healthStationId) REFERENCES healthStations(healthStationId),
    FOREIGN KEY (registerdBy) REFERENCES users(userId)
);

CREATE TABLE IF NOT EXISTS news (
    newsId INT PRIMARY KEY AUTO_INCREMENT,
    writerId INT,
    titleAm VARCHAR(255),
    titleOr VARCHAR(255),
    descriptionAm TEXT,
    descriptionOr TEXT,
    imageUrl VARCHAR(255),
    createdDateTime DATETIME,
    FOREIGN KEY (writerId) REFERENCES admins(adminId)
);

CREATE TABLE IF NOT EXISTS vaccines (
    vaccineId INT PRIMARY KEY AUTO_INCREMENT,
    registerdBy INT,
    name VARCHAR(255),
    category VARCHAR(100),
    dose INT,
    duration INT,
    description TEXT,
    ageRange VARCHAR(50),
    createdDateTime DATETIME,
    FOREIGN KEY (registerdBy) REFERENCES admins(adminId)
);

CREATE TABLE IF NOT EXISTS users (
    userId INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255),
    phone VARCHAR(15),
    role VARCHAR(50),
    activeStatus BOOLEAN,
    password VARCHAR(255),
    otp INT,
    otpCreatedDateTime DATETIME,
    otpExpiry DATETIME
);

CREATE TABLE IF NOT EXISTS userProfiles (
    userProfileId INT PRIMARY KEY AUTO_INCREMENT,
    userId INT,
    firstname VARCHAR(100),
    middlename VARCHAR(100),
    lastname VARCHAR(100),
    sex VARCHAR(10),
    imageUrl VARCHAR(255),
    FOREIGN KEY (userId) REFERENCES users(userId)
);

CREATE TABLE IF NOT EXISTS professionalProfile (
    professionalProfileId INT PRIMARY KEY AUTO_INCREMENT,
    userId INT,
    healthStationId INT,
    title VARCHAR(100),
    position VARCHAR(100),
    FOREIGN KEY (userId) REFERENCES users(userId),
    FOREIGN KEY (healthStationId) REFERENCES healthStations(healthStationId)
);

CREATE TABLE IF NOT EXISTS mother (
    motherId INT PRIMARY KEY AUTO_INCREMENT,
    userId INT,
    birthdate DATE,
    bloodType VARCHAR(10),
    RH VARCHAR(10),
    FOREIGN KEY (userId) REFERENCES users(userId)
);

CREATE TABLE IF NOT EXISTS children (
    childId INT PRIMARY KEY AUTO_INCREMENT,
    motherId INT,
    registerdBy INT,
    firstname VARCHAR(100),
    middlename VARCHAR(100),
    lastname VARCHAR(100),
    birthdate DATE,
    bloodType VARCHAR(10),
    isVaccineCompleted BOOLEAN,
    FOREIGN KEY (motherId) REFERENCES mother(motherId),
    FOREIGN KEY (registerdBy) REFERENCES users(userId)
);

CREATE TABLE IF NOT EXISTS motherVaccine (
    motherVaccineId INT PRIMARY KEY AUTO_INCREMENT,
    motherId INT,
    vaccineId INT,
    createdDateTime DATETIME,
    healthStationId INT,
    registerdBy INT,
    FOREIGN KEY (motherId) REFERENCES mother(motherId),
    FOREIGN KEY (vaccineId) REFERENCES vaccines(vaccineId),
    FOREIGN KEY (healthStationId) REFERENCES healthStations(healthStationId),
    FOREIGN KEY (registerdBy) REFERENCES users(userId)
);

CREATE TABLE IF NOT EXISTS childrenVaccine (
    childrenVaccineId INT PRIMARY KEY AUTO_INCREMENT,
    childId INT,
    vaccineId INT,
    createdDateTime DATETIME,
    healthStationId INT,
    registerdBy INT,
    FOREIGN KEY (childId) REFERENCES children(childId),
    FOREIGN KEY (vaccineId) REFERENCES vaccines(vaccineId),
    FOREIGN KEY (healthStationId) REFERENCES healthStations(healthStationId),
    FOREIGN KEY (registerdBy) REFERENCES users(userId)
);

CREATE TABLE IF NOT EXISTS certification (
    certificationId INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    childId INT,
    issuedDate DATE,
    healthStationId INT,
    registerdBy INT,
    FOREIGN KEY (childId) REFERENCES children(childId),
    FOREIGN KEY (healthStationId) REFERENCES healthStations(healthStationId),
    FOREIGN KEY (registerdBy) REFERENCES users(userId)
);

CREATE TABLE IF NOT EXISTS appointment (
    appointmentId INT PRIMARY KEY AUTO_INCREMENT,
    userId INT,
    healthStationId INT,
    registerdBy INT,
    createdDateTime DATETIME,
    appointmentDate DATE,
    description TEXT,
    vaccineId INT,
    FOREIGN KEY (userId) REFERENCES users(userId),
    FOREIGN KEY (healthStationId) REFERENCES healthStations(healthStationId),
    FOREIGN KEY (registerdBy) REFERENCES users(userId),
    FOREIGN KEY (vaccineId) REFERENCES vaccines(vaccineId)
);
