const { client } = require("../common/common");

const getAllUsers = async () => {
  const query = `
    SELECT 
      users.id, 
      users.email, 
      users.username, 
      users.major_id, 
      users.is_admin,
      major.name AS major_name
    FROM users
    LEFT JOIN major ON users.major_id = major.id;
  `;
  const result = await client.query(query);
  return result.rows;
};

// Get User By ID with Major Name
const getUserById = async (id) => {
  const query = `
    SELECT 
      users.id, 
      users.email, 
      users.username, 
      users.major_id, 
      users.is_admin,
      major.name AS major_name
    FROM users
    LEFT JOIN major ON users.major_id = major.id
    WHERE users.id = $1;
  `;
  const result = await client.query(query, [id]);

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  return result.rows[0];
};

// Update User
const updateUser = async (id, { email, username, major_id, is_admin, password }) => {
  const query = `
    UPDATE users 
    SET 
        email = COALESCE($1, email), 
        username = COALESCE($2, username), 
        major_id = COALESCE($3::integer, major_id), 
        is_admin = COALESCE($4::boolean, is_admin),
        password = COALESCE($5, password)
    WHERE id = $6
    RETURNING id, email, username, major_id, is_admin;
  `;
  const values = [email, username, major_id, is_admin, password, id];
  const result = await client.query(query, values);

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  return getUserById(id);
};


// Delete User
const deleteUser = async (id) => {
  const query = `
    DELETE FROM users 
    WHERE id = $1 
    RETURNING id, email;
  `;
  const result = await client.query(query, [id]);

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  return result.rows[0];
};

const getUsersByMajorId = async (majorId) => {
  try {
    const query = `
      SELECT id, email, username, major_id, is_admin
      FROM users
      WHERE major_id = $1
    `;
    const values = [majorId];
    const result = await client.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("Error fetching users by major_id:", error);
    throw error;
  }
};


module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUsersByMajorId
};