import React, { useState, useEffect } from 'react';
import { DiscordSDK } from '@discord/embedded-app-sdk';
import Interface from '../Interface.jsx';
import BoardProject from '../Boards/BoardProject.jsx';
import ErrorBoundary from '/ErrorBoundary.jsx';
import '/styles/sidebar.css';
import logo from '../../assets/Planifylogo.png'

const Project = () => {
  const [discordSdk, setDiscordSdk] = useState(null);
  const [user, setUser] = useState(null);
  const [members,setMembers]=useState([{ id: "648459618963554314", name: 'Achi' , avatar:"9a63d2375b9fa5cd8c34aef086635a23"}, { id: "791173089697464400", name: 'Avicii' , avatar:"cf23f00eed64b8d04564eb367b00468b" }])
  const [memberToBe,_] = useState([648459618963554314,791173089697464400])

  useEffect(() => {
    const setupDiscordSdk = async () => {
      try {
        const discordClientId = import.meta.env.VITE_DISCORD_CLIENT_ID;

        if (!discordClientId) {
          throw new Error('Discord Client ID is missing');
        }

        console.log('Setting up Discord SDK...');

        // Initialize Discord SDK
        const sdk = new DiscordSDK(discordClientId);
        await sdk.ready();

        console.log('Discord SDK Ready...');

        // Authorize with Discord OAuth
        const { code } = await sdk.commands.authorize({
          client_id: discordClientId,
          response_type: 'code',
          state: '',
          prompt: 'none',
          scope: ['identify', 'guilds', 'applications.commands'],
        });

        console.log('Authorization code received...');

        // Exchange authorization code for access token
        const response = await fetch('/.proxy/api/api/v1/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch access token');
        }

        const { access_token } = await response.json();
        console.log('Access Token received...');
        window.token = access_token // unsafe but yeah 

        // Authenticate with Discord SDK using the access token
        await sdk.commands.authenticate({ access_token });

        console.log('Authentication successful...');

        // Fetch the user profile
        const userProfile = await fetchUserProfile(access_token);
        console.log('User Profile:', userProfile);

        setUser({
          username: userProfile.username,
          avatarUrl: `https://cdn.discordapp.com/avatars/${userProfile.id}/${userProfile.avatar}.png`,
        });

        //const mem = await Promise.all(memberToBe.map(async(id)=> await (await fetch(`https://discord.com/api/v9/users/${id}`)).json()))
        //console.log(mem)
        //setMembers(mem.map(x=>{return{id:x.id,name:x.username,avatar:x.avatar}}))

        setDiscordSdk(sdk);
      } catch (error) {
        console.error('Error setting up Discord SDK:', error);
        setUser({
          username: "placeholder",
          avatarUrl: ""})
      }
    };

    const fetchUserProfile = async (token) => {
      const response = await fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      return await response.json();
    };

    setupDiscordSdk();
  }, []);

  const handleConfirmation = () => {
    setIsConfirmationVisible(false);
  };

  const handleSettings = () => {
    console.log("hi")
  };

  if (!user) {
    console.log('User data is still loading...');
    return <div>Loading...</div>;
  }

  return (
    <div id="app">
      <ErrorBoundary>
        <img src={logo} width="100" height="45" style={{position: "fixed", 
  top: "4.5%", 
  left: "11%", 
  transform: "translate(-50%, -50%)", 
  zIndex: 10000 
}} />
        <Interface user={user}/>
        
        {/* /api/v1/project/{projectId}/members */}

        users/
        <BoardProject  members={members}/>
        {/* Task List and Member Components */}
      </ErrorBoundary>
    </div>
  );
};

export default Project;
