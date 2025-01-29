import React, { useState, useContext } from 'react';
import Image from 'next/image';

//INTERNAL IMPORT
import Style from './Filter.module.css';
import images from '../../assets';
import { KKMChatAppContext } from '@/Context/KKMChatAppContext';
import { Model } from '../index';

const Filter = () => {
    const { account, addFriends } = useContext(KKMChatAppContext);
  
    //USESTATE
    const [addFriend, setAddFriend] = useState(false);
    return (
      <div className={Style.Filter}>
        <div className={Style.Filter_box}>
          <div className={Style.Filter_box_left}>
            <div className={Style.Filter_box_left_search}>
              <Image src={images.search} alt="image" width={20} height={20} />
              <input type="text" placeholder="ရှာမည်.." />
            </div>
          </div>
          <div className={Style.Filter_box_right}>
            <button>
              <Image src={images.clear} alt="clear" width={20} height={20} />
              ပို့ထားသည်များကို ဖျက်မည်
            </button>
            <button onClick={() => setAddFriend(true)}>
              <Image src={images.user} alt="clear" width={20} height={20} />
              ဆက်သွယ်မည်
            </button>
          </div>
        </div>
  
        {/* //MODEL COMPONENT */}
        {addFriend && (
          <div className={Style.Filter_model}>
            <Model
              openBox={setAddFriend}
              title="စကားဝိုင်းတွင် ပါဝင်ရန်"
              head="ဖိတ်ခေါ်ပါသည်"
              info="ဤစကားဝိုင်းသည် မှတ်ပုံတင်ထားသူများအကြား တစ်ဦးနှင့် တစ်ဦး အပြန်အလှန် ဆက်သွယ်ပြောဆိုကြရာတွင် ယင်းတို့၏ သတင်းစကားနှင့် အချက်အလက်များ အပြည့်အဝ လုံခြုံစိတ်ချရမှု ရှိစေရေးအတွက် blockchain နည်းပညာကို အခြေခံ တည်ဆောက်ထားသော ဆက်သွယ်ရေး စနစ်တစ်ခု ဖြစ်ပါသည်။"
              smallInfo="သင် ဆက်သွယ်လိုသူ၏ အမည်နှင့် လိပ်စာကို ထည့်ပါ.."
              image={images.hero}
              functionName={addFriends}
            />
          </div>
        )}
      </div>
    );
  };
  
  export default Filter;