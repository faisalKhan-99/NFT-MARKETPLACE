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

//day 5 
createItem = async()=>{
	//did the user select a file?
	console.log('here');
	if(createItemFile.files.length==0){
		alert('Please select a file to upload');
		console.log('if here');
		return;
	}
	//selected a name?
	else if(createItemNameField.value.length==0){
		alert('Please specify a name');
		console.log('else here');
		return;
	}
	//create and store on IPFS now
	const nftFile = new Moralis.File('nftFile.jpg',createItemFile.files[0]);
	await nftFile.saveIPFS();

	const nftFilePath = nftFile.ipfs();
	const nftFileHash = nftFile.hash();

	const metadata = {
		name: createItemNameField.value,
		description: createItemDescriptionField.value,
		nftFilePath: nftFilePath,
		nftFileHash: nftFileHash,
	}; //now we wanna store this file on IPFS

	const nftFileMetadataFile = new Moralis.File("metadata.json", {base64 : btoa(JSON.stringify(metadata))});
	await nftFileMetadataFile.saveIPFS();


	const nftFileMetadataFilePath = nftFileMetadataFile.ipfs();
	const nftFileMetadataFileHash = nftFileMetadataFile.hash();


	// Simple syntax to create a new subclass of Moralis.Object.
	const Item = Moralis.Object.extend("Item");

	// Create a new instance of that class.
	const item = new Item();
	item.set('name', createItemNameField.value);
	item.set('description', createItemDescriptionField.value);
	item.set('nftFilePath', nftFilePath);
	item.set('nftFileHash', nftFileHash);
	item.set('MetadataFilePath', nftFileMetadataFilePath);
	item.set('MetadataFileHash',nftFileMetadataFileHash);
	await item.save();
	console.log(item);
}


hideElement = (element) => element.style.display = "none"; //hide somthing on screen
showElement = (element) => element.style.display = "block";

//Navbar	

const userConnectButton = document.getElementById("btnConnect");
userConnectButton.onclick = login;

const userProfileButton= document.getElementById("btnUserInfo");
userProfileButton.onclick = openUserInfo;

const openCreateItemButton= document.getElementById("btnOpenCreateItem");
openCreateItemButton.onclick = () =>showElement(createItemForm);



//user profile
const userInfo= document.getElementById("userInfo");
//Day 3
const userUsernameField= document.getElementById("textUsername");
const userEmailField= document.getElementById("txtEmail");
const userAvatarImg= document.getElementById("imgavatar");
const userAvatarFile= document.getElementById("fileAvatar");

document.getElementById("btnCloseUserInfo").onclick = () => hideElement(userInfo);

document.getElementById("btnLogout").onclick = logout;//hook up the funcionality to the button
document.getElementById("btnSaveUserInfo").onclick = saveUserInfo;


//Item Creation
//Day 4 
const createItemForm= document.getElementById("createItem");

const createItemNameField= document.getElementById("txtCreateItemName");
const createItemDescriptionField= document.getElementById("txtCreateItemDescription");
const createitemPriceField= document.getElementById("numCreateItemPrice");
const createItemStatusField= document.getElementById("selectCreateItemStatus");
const createItemFile= document.getElementById("fileCreateItemFile");

document.getElementById("btnCloseCreateItem").onclick = () => hideElement(createItemForm);

const createplease = document.getElementById("btnCreateItem");
createplease.onclick = createItem;
 		

init();