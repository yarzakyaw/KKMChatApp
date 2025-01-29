import React, { useState, useEffect, useContext} from 'react';

//INTERNAL IMPORT
import { UserCard } from '@/Components/index';
import Style from '../styles/alluser.module.css';
import { KKMChatAppContext } from '@/Context/KKMChatAppContext';

const alluser = () => {
    const { userLists, addFriends } = useContext(KKMChatAppContext);
    return (
      <div>
        <div className={Style.alluser_info}>
          <h1> သင် ဆက်သွယ်ပြောဆိုလိုသူများကို ရှာပါ </h1>
        </div>
  
        <div className={Style.alluser}>
          {userLists.map((el, i) => (
            <UserCard key={i + 1} el={el} i={i} addFriends={addFriends} />
          ))}
        </div>
      </div>
    );
  };
  
  export default alluser;