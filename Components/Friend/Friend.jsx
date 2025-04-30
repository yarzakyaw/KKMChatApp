import React, { useState, useContext } from 'react';
import Image from 'next/image';

//INTERNAL IMPORT
import Style from './Friend.module.css';
import images from '../../assets';
import Card from './Card/Card';
import Chat from './Chat/Chat';
import { KKMChatAppContext } from '@/Context/KKMChatAppContext';

const Friend = () => {
    const {
      sendMessage,
      account,
      friendLists,
      readMessage,
      userName,
      loading,
      friendMsg,
      currentUserName,
      currentUserAddress,
      readUser,
    } = useContext(KKMChatAppContext);

    // State to track selected friend
    const [selectedFriend, setSelectedFriend] = useState(null);

    const handleSelectFriend = (friend) => {
      console.log("Selected friend:", friend);
      setSelectedFriend(friend);
      readMessage(friend.pubkey);
      readUser(friend.pubkey);
    };
  
    return (
      <div className={Style.Friend}>
        <div className={Style.Friend_box}>
          <div className={Style.Friend_box_left}>
            {friendLists.map((el, i) => (
              <div
              key={i + 1}
              onClick={() => handleSelectFriend(el)}
              className={Style.Friend_card_wrapper}>
                <Card
                  key={i + 1}
                  el={el}
                  i={i}
                  readMessage={readMessage}
                  readUser={readUser}
                />
            </div>
            ))}
          </div>
          <div className={Style.Friend_box_right}>
          {selectedFriend ? (
            <Chat
              functionName={sendMessage}
              readMessage={readMessage}
              friendMsg={friendMsg}
              account={account}
              userName={userName}
              loading={loading}
              currentUserName={currentUserName}
              currentUserAddress={currentUserAddress}
              readUser={readUser}
              chatData={{ name: selectedFriend.name, address: selectedFriend.pubkey }}
            />
          ) : (
            <div className={Style.Friend}>
              <p><large>ပြောဆိုလိုသူကို ရွေးချယ်ပါ</large></p>
            </div>
          )}
          </div>
        </div>
      </div>
    );
  };
  
  export default Friend;