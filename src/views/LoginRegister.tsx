import {useState} from "react"
import {Keyboard, StyleSheet, TouchableOpacity} from "react-native";
import {Text} from "@rneui/base";
import Login from "../components/Login";
import Register from "../components/Register";

const LoginRegister = () => {
  const [register, setRegister] = useState(false);
  const handleToggle = () => setRegister(!register);

  return (
    <TouchableOpacity
      style={{flex: 1, justifyContent: 'center'}}
      onPress={() => Keyboard.dismiss()}
      activeOpacity={1}
    >
      {!register ? <Login /> : <Register handleToggle={handleToggle} />}
      <TouchableOpacity style={styles.linkText} onPress={handleToggle}>
        <Text style={{color: '#5d71c9'}}>
          {register ? 'Takaisin kirjautumiseen' : 'Luo uusi käyttäjä'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 0,
    width: 250,
    backgroundColor: '#5d71c9',
    marginBottom: 10,
    borderRadius: 5,
  },
  linkText: {
    marginBottom: 50,
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
  },
});

export default LoginRegister;
