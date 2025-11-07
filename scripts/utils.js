const { db } = require("../db/db.connection.js");

const getAllCollections = async () => {
  return await db.listCollections().toArray();
};

const listAllCollections = async () => {
  const collections = await getAllCollections();
  console.log(
    "Existing collections:",
    collections.map((col) => col.name)
  );
};

const collectionExists = async (collectionName) => {
  const collections = await getAllCollections();
  return collections.some((col) => col.name === collectionName);
};

module.exports = {
  listAllCollections,
  collectionExists,
};
