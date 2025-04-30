import React, { useEffect, useState, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';

//INTERNAL IMPORT
import Style from './NavBar.module.css';
import { KKMChatAppContext } from '@/Context/KKMChatAppContext';
import { Model, Error } from '../index';
import images from '../../assets';

const NavBar = () => {
    const menuItems = [
      {
        menu: "မှတ်ပုံတင်ထားသူများ",
        link: "alluser",
      },
      {
        menu: "စကားဝိုင်း",
        link: "/",
      },
    ];
  
    //USESTATE
    const [active, setActive] = useState(1);
    const [open, setOpen] = useState(false);
    const [openModel, setOpenModel] = useState(false);
  
    const { account, userName, connectWallet, createAccount, error } =
      useContext(KKMChatAppContext);
    return (
      <div className={Style.NavBar}>
        <div className={Style.NavBar_box}>
          <div className={Style.NavBar_box_left}>
            <Image src={images.hero} alt="hero" width={200} height={200} />
          </div>
          <div className={Style.NavBar_box_right}>
            {/* //DESKTOP */}
            <div className={Style.NavBar_box_right_menu}>
              {menuItems.map((el, i) => (
                <div
                  onClick={() => setActive(i + 1)}
                  key={i + 1}
                  className={`${Style.NavBar_box_right_menu_items} ${
                    active == i + 1 ? Style.active_btn : ""
                  }`}
                >
                  <Link
                    className={Style.NavBar_box_right_menu_items_link}
                    href={el.link}
                  >
                    {el.menu}
                  </Link>
                </div>
              ))}
            </div>
  
            {/* //MOBILE */}
            {open && (
              <div className={Style.mobile_menu}>
                {menuItems.map((el, i) => (
                  <div
                    onClick={() => setActive(i + 1)}
                    key={i + 1}
                    className={`${Style.mobile_menu_items} ${
                      active == i + 1 ? Style.active_btn : ""
                    }`}
                  >
                    <Link className={Style.mobile_menu_items_link} href={el.link}>
                      {el.menu}
                    </Link>
                  </div>
                ))}
  
                <p className={Style.mobile_menu_btn}>
                  <Image
                    src={images.close}
                    alt="close"
                    width={50}
                    height={50}
                    onClick={() => setOpen(false)}
                  />
                </p>
              </div>
            )}
  
            {/* CONNECT WALLET */}
            {/* <div className={Style.NavBar_box_right_connect}>
              {account == "" ? (
                <button onClick={() => connectWallet()}>
                  {""}
                  <span>Connect Wallet</span>
                </button>
              ) : (
                <button onClick={() => setOpenModel(true)}>
                  {""}
                  <Image
                    src={userName ? images.accountName : images.create2}
                    alt="Account image"
                    width={20}
                    height={20}
                  />
                  {""}
                  <small>{userName || "အမည်စာရင်း မှတ်ပုံတင်ပါ"}</small>
                </button>
              )}
            </div> */}

            <div className={Style.NavBar_box_right_connect}>
              {account && userName ? (
                <button onClick={() => setOpenModel(true)}>
                  {""}
                  <Image
                    src={images.accountName}
                    alt="Account image"
                    width={20}
                    height={20}
                  />
                  {""}
                  <small>{userName}</small>
                </button>
              ) : (
                <button onClick={() => setOpenModel(true)}>
                  {""}
                  <span><small>{"အမည်စာရင်း မှတ်ပုံတင်ပါ"}</small></span>
                </button>
              )}
            </div>
  
            <div
              className={Style.NavBar_box_right_open}
              onClick={() => setOpen(true)}
            >
              <Image src={images.open} alt="open" width={30} height={30} />
            </div>
          </div>
        </div>
        {/* <div className={Style.NavBar_box}>
          <div className={Style.NavBar_box_left}>
            <Image src={images.loader} alt="loader" width={70} height={70} />
          </div>
        </div> */}
  
        {/* MODEL COMPONENT */}
        {openModel && (
          <div className={Style.modelBox}>
            <Model
              openBox={setOpenModel}
              title="စကားဝိုင်းတွင် ပါဝင်ရန်"
              head="ဖိတ်ခေါ်ပါသည်"
              info="ဤစကားဝိုင်းသည် မှတ်ပုံတင်ထားသူများအကြား တစ်ဦးနှင့် တစ်ဦး အပြန်အလှန် ဆက်သွယ်ပြောဆိုကြရာတွင် ယင်းတို့၏ သတင်းစကားနှင့် အချက်အလက်များ အပြည့်အဝ လုံခြုံစိတ်ချရမှု ရှိစေရေးအတွက် blockchain နည်းပညာကို အခြေခံ တည်ဆောက်ထားသော ဆက်သွယ်ရေး စနစ်တစ်ခု ဖြစ်ပါသည်။"
              smallInfo="ကျေးဇူးပြု၍ သင်၏ အမည်ကို ထည့်သွင်းပါ..."
              image={images.hero}
              functionName={createAccount}
              address={account}
            />
          </div>
        )}
        {error == "" ? "" : <Error error={error} />}
      </div>
    );
  };
  
  export default NavBar;