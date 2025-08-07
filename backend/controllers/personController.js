import Person from "../models/Person.js";

export const getCurrentPerson = async (req, res) => {
  try {
    // Fetch the user's details except password using the id
    const person = await Person.findById(req.person.id).select("-password");
    res.json({ success: true, person })
  } catch (err) {
    // Catch the error
    console.log(err.message);
    res.status(500).json({ success: false, error: 'Interal Server Error', message: err.message });
  }
}