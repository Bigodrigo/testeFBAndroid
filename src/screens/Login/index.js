//Página pelos vídeos, tentar reproduzir uma página pelo RocketSeat
import React, { useContext, useEffect, useState } from "react";
import { Image, Alert } from "react-native";
import { VStack, NativeBaseProvider, Center, Text, Icon, Link, Pressable } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
//estilos e afins
import { fonts, colors, styles } from "../../styles";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
//firebase
import { auth, db } from "../../firebase";
import { CurrentUserContext } from "../../components/Context/User";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { userConverter } from "../../utils/converter"; 
//uid aqui ou na home?
//rotas
import { SignUp } from "../SignUp";

export function Login({children}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = React.useState(false);
  const [userNovo, setUserNovo] = useState(false);
  //eu estou usando o usercontext direto, o joao usou separado, pode dar erro aqui!!
  const {setCurrentUser, logado, setLogado, login, logout} = useContext(CurrentUserContext);

  //Importante: Eu tentei fazer o yup controlar o envio de infos, mas deu errado, vou tirar por h e deixar mais simples!

   async function handleLogin() {
    //com o yup precisa colocar data dentro dos () aqui em cima!!
    //console.log(data);
    setLoading(true);
        if(email === '' || password === '') {
            Alert.alert('Algo deu errado!', 'Preencha todos os campos primeiro!');
            console.log('Algo deu errado!', 'Preencha todos os campos primeiro!');
            setLoading(false);
            return;
        };
        await signInWithEmailAndPassword(auth, email, password).then(async(userCredential) => {
          let user = userCredential.user;
          const uid = user.uid;
          const docRef = doc(db,uid,'Infos').withConverter(userConverter)
          const testeSnap = await getDoc(docRef);
          if (testeSnap.exists()) {
            const user = testeSnap.data();
            setCurrentUser({
            email: user.email,
            name: user.name,
            password: user.password,
            uid: user.uid,
            });
            setLoading(false);
            login();}
             else {
            console.log("No such document!");
          }    
          //talvez precise do return para fechar o constante envio de infos! Aqui ele usa a função setLogin, para carregar?
        })
        .catch(error => 
          console.log(error),
          //Alert.alert('Email ou senha inválidos!', 'Verifique as infos!')
          );
      };

  function resetPassword() { //código do vídeo
    //com o yup precisa colocar data dentro dos () aqui em cima!!
    //console.log(email)
    if(email === '') {
      //o código n está passando por aqui, talvez tenha q definir data email ='' primeiro?!
      Alert.alert('Algo deu errado!', ' Preencha o campo de email para redefinir nova senha');
      console.log("Algo deu errado! Preencha o campo de email para redefinir nova senha");
      return;};
    sendPasswordResetEmail(auth, email)
    .then(() => {
      Alert.alert('Email enviado', 'Olhe seu email para mudar a senha!'),
      console.log("Enviou email de troca de senha!!")
  })
    .catch(error => console.log(error));
  };

  return ( 
    <NativeBaseProvider>
      { userNovo  ? <SignUp userNovo={userNovo} setUserNovo={setUserNovo}/>
      :
      <VStack flex={1} px={10}>
        <Center>
          <Image
            source={require("../../assets/icon_no_bg.png")}
            style={styles.imageLogo}
          />
          <Text style={{ color: "white", fontFamily: fonts.bold }} mb={5}>
            Página de Login
          </Text>
          <Input
            value={email}
            onChangeText={setEmail}
            style={styles.inputPassword}
            placeholder="E-mail"
            placeholderTextColor={colors.blue_tertiary}
            backgroundColor = {colors.blue_secondary}
            borderColor = {colors.blue_tertiary}
          />
          <Input
            type={show ? "text" : "password"} 
            InputRightElement={<Pressable onPress={() => setShow(!show)}>
            <Icon as={<MaterialIcons
            name={show ? "visibility" : "visibility-off"} />} size={5} marginRight={5}
            color={colors.blue_tertiary} // n ficou funcional, voltar aqui
            /></Pressable>}
            value={password}
            onChangeText={setPassword}
            style={styles.inputPassword}
            placeholder="Senha"
            placeholderTextColor={colors.blue_tertiary}
            backgroundColor = {colors.blue_secondary}
            borderColor = {colors.blue_tertiary}
          />
          <Link 
            onPress={()=>setUserNovo(true)}
            //disabled={loading}
          >
            <Text style={styles.textResetPassword}>
                Criar uma conta
            </Text>
          </Link>
          <Button 
            title="ENTRAR" 
            onPress={handleLogin} 
            disabled={loading} 
            backgroundColor = {colors.blue_tertiary}
            //aqui no terceiro vídeo ele coloca em 1h um loading, para barrar o envio infinito!
          />
          <Link onPress={()=>resetPassword}>
            <Text  style={styles.textResetPassword}>
                Esqueceu a Senha?
            </Text>
          </Link>
        </Center>
      </VStack>}
    </NativeBaseProvider>
  );  
}