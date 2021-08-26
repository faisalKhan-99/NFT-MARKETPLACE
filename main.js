Moralis.initialize("gIcaPQaMEzAVkd8fM0o2SzZHbe6vsYKf3tsqjB6B");

Moralis.serverURL = 'https://2kjg3qq1tgll.moralisweb3.com:2053/server';

init = async() =>{
	hideElement(userInfo);
	hideElement(createItemForm);
	window.web3= await Moralis.Web3.enable(); //moralis enabled and connected to web3
	initUser();
}

initUser = async() =>{
	//checking if the user is already logged in 
	if(await Moralis.User.current()){
		hideElement(userConnectButton);
		showElement(userProfileButton);
		showElement(openCreateItemButton);
	}	else{
		hideElement(userProfileButton);
		showElement(userConnectButton);
		hideElement(openCreateItemButton);
	}
}

login = async()=>{
	try{
		await Moralis.Web3.authenticate();
		initUser();
	}catch(error){
		alert(error);
	}
}

logout = async()=> {
	await Moralis.User.logOut();
	hideElement(userInfo); 
	initUser();//because it'll handle further logic to display correct button if user isnt loggged in 
}

//function to open the userinfo upon clicking profile
openUserInfo = async()=>{
	user = await Moralis.User.current();//this will load current user into user object		
	if(user){//setting info to the variables created
		const email = user.get('email'); 
		if(email){
			userEmailField.value= email;
		}else{
			userEmailField.value = "";
		}
		userUsernameField.value = user.get('username');
		
		const userAvatar = user.get('avatar');
		if(userAvatar){
			userAvatarImg.src=userAvatar.url();
			showElement(userAvatarImg);
		}else{
			hideElement(userAvatarImg);
		}

		showElement(userInfo);
	}else{
		login();
	}
}

saveUserInfo = async()=>{
	user.set('email',userEmailField.value);
	user.set('username',userUsernameField.value);

	if (userAvatarFile.files.length > 0) { //from docs->files
  const file = userAvatarFile.files[0];
  const name = "avatar.jpg";

  const avatar = new Moralis.File(name, file);
  user.set('avatar',avatar);
	}

	await user.save();
	alert("User info saved successfully");
	openUserInfo();
}


hideElement = (element) => element.style.display = "none"; //hide somthing on screen
showElement = (element) => element.style.display = "block";

const userConnectButton = document.getElementById("btnConnect");
userConnectButton.onclick = login;

const userProfileButton= document.getElementById("btnUserInfo");
userProfileButton.onclick = openUserInfo;

const userInfo= document.getElementById("userInfo");
//part3
const userUsernameField= document.getElementById("textUsername");
const userEmailField= document.getElementById("txtEmail");
const userAvatarImg= document.getElementById("imgavatar");
const userAvatarFile= document.getElementById("fileAvatar");

document.getElementById("btnCloseUserInfo").onclick = () => hideElement(userInfo);

document.getElementById("btnLogout").onclick = logout;//hook up the funcionality to the button
document.getElementById("btnSaveUserInfo").onclick = saveUserInfo;


const createItemForm= document.getElementById("createItem");

const createItemNameField= document.getElementById("txtCreateItemName");
const createItemDescriptionField= document.getElementById("txtCreateItemDescription");
const createitemPriceField= document.getElementById("numCreateItemPrice");
const createItemStatusField= document.getElementById("selectCreateItemStatus");
const createItemFileField= document.getElementById("fileCreateItemFile");



const openCreateItemButton= document.getElementById("btnOpenCreateItem");
openCreateItemButton.onclick = () =>showElement(createItemForm);
document.getElementById("btnCloseCreateItem").onclick = () => hideElement(createItemForm);


init();