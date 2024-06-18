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
      <TouchableOpacity style={styles.button} onPress={handleToggle}>
        <Text style={{color: '#EEEEEE'}}>
          {register ? 'Kirjaudu sisään' : 'Luo uusi käyttäjä'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '50%',
    backgroundColor: '#5d71c9',
    marginBottom: 30,
    borderRadius: 5,
    padding: 10,
    alignSelf: 'center',
    alignItems: 'center',
  },
  linkText: {
    marginBottom: 50,
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
  },
});

export default LoginRegister;
