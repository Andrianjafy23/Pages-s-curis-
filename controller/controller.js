import User from "../models/user.js";
import bcrypt from "bcrypt";

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.send(`<script>
                          alert("Utilisateur non trouvé");
                          window.history.back();
                        </script>`);
    }
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
      return res.send(`<script>
                          alert("Mot de passe incorrect");
                          window.history.back();
                        </script>`);
    }
    req.session.userId = foundUser._id;
    req.session.userName = foundUser.name;
    res.send(`<script>
                alert('Connexion réussie!');
                window.location.href='/secure';
              </script>`);
  } catch (err) {
    console.error(err);
    res.send(`<script>
                alert("Erreur lors de la connexion");
                window.history.back();
              </script>`);
  }
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.send(`<script>
                      alert("Tous les champs sont requis !");
                      window.history.back();
                    </script>`);
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.send(`<script>
                alert("Inscription réussie !");
                window.location.href="/";
              </script>`);
  } catch (err) {
    console.error(err);
    res.send(`<script>
                alert("Erreur lors de l'inscription!");
                window.location.href="/inscrit";
              </script>`);
  }
};

export const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
