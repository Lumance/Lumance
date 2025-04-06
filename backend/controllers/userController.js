const getUser = (req, res) => {
    res.json(req.user);  // Assuming user data is attached to the request object after token validation
};

module.exports = {
    getUser
}