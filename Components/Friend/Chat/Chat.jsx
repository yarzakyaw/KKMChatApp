import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

//INTERNAL IMPORT
import Style from './Chat.module.css';
import images from '../../../assets';
import { convertTime } from '@/Utils/apiFeature';
import { Loader } from '../../index';

const Chat = ({
    functionName,
    readMessage,
    friendMsg,
    account,
    userName,
    loading,
    currentUserName,
    currentUserAddress,
    readUser
  }) => {
    //USTE STATE
    const [message, setMessage] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [chatData, setChatData] = useState({
      name: "",
      address: "",
    });
    const router = useRouter();
  
    useEffect(() => {
      if (!router.isReady) return;
      setChatData(router.query);
    }, [router.isReady]);
  
    /* useEffect(() => {
      if (chatData.address) {
        readMessage(chatData.address);
        readUser(chatData.address);
      }
    }, []); */
    useEffect(() => {
      if (chatData.address) {
        readMessage(chatData.address);
        readUser(chatData.address);
      }
    }, [chatData.address, readMessage, readUser]);

    const logToServer = async (message) => {  
      try {  
        const response = await fetch('/api/log', {  
          method: 'POST',  
          headers: {  
            'Content-Type': 'application/json',  
          },  
          body: JSON.stringify({ message }),  
        });  
    
        if (!response.ok) {  
          throw new Error('Failed to log message');  
        }  
    
        await response.json(); // Optional: process the response if needed  
      } catch (error) {  
        console.error('Error logging to server:', error);  
      }  
    };

    const handleSendMessage = async () => {
      if (!chatData.address) return; 
      await logToServer("Starting to send message");
  
      // Check if a file is selected
      if (selectedFile) {
          const fileType = selectedFile.type;
          await logToServer(`Selected file type: ${fileType}`);
          await logToServer(`Selected file name: ${selectedFile.name}`);
  
          if (fileType.startsWith('image/')) {
              await functionName({  
                  msg: message,  
                  address: chatData.address,  
                  file: selectedFile, 
              });  
              await logToServer("Sent an image file"); 
          } else if (fileType === 'application/pdf' ||
                     fileType === 'application/msword' ||
                     fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                     fileType === 'application/vnd.ms-excel' ||   
                     fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                     fileType === 'application/vnd.ms-powerpoint' ||
                     fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
                     fileType === 'text/plain') {
              // Handle document file
              await functionName({
                  msg: message,
                  address: chatData.address,
                  file: selectedFile,
              });
              await logToServer("Sent a document file"); 
          } else if (fileType.startsWith('video/')) {
            await functionName({  
                msg: message,  
                address: chatData.address,  
                file: selectedFile, 
            });  
            await logToServer("Sent an video file"); 
          } else if (fileType.startsWith('audio/')) {
            await functionName({  
                msg: message,  
                address: chatData.address,  
                file: selectedFile, 
            });  
            await logToServer("Sent an audio file"); 
          } else {
              alert("သတ်မှတ်ဖိုင်အမျိုးအစား မဟုတ်ပါ။ ပုံ သို့မဟုတ် စာဖိုင် တစ်ခုခုကိုသာ ရွေးပါ။");
              return;
          }
      } else {
        if (message != "") {
          await functionName({
              msg: message,
              address: chatData.address,
              file: null
          });
          await logToServer("Sent a text message");
        }
          // If no file is selected, just send the message
          /* await functionName({
              msg: message,
              address: chatData.address,
              file: null,
          }); */
      }
  
      // Clear inputs after sending  
      setMessage("");  
      setSelectedFile(null);
    };

    const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 5 MB limit

    const handleFileChange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > MAX_FILE_SIZE) {
          alert("ဖိုင်အရွယ်အစား သတ်မှတ် ၁ ဂဂ္ဂါဗိုက်ထက် ကျော်လွန်နေပါသည်။");
          setSelectedFile(null); // Clear the selected file
        } else {  
          setSelectedFile(file); // Set the selected file if within limit
        }
      }
    };
  
    // console.log(chatData.address, chatData.name);
    return (
      <div className={Style.Chat}>
        {currentUserName && currentUserAddress ? (
          <div className={Style.Chat_user_info}>
            <Image src={images.accountName} alt="image" width={70} height={70} />
            <div className={Style.Chat_user_info_box}>
              <h4>{currentUserName}</h4>
              <p className={Style.show}>{currentUserAddress}</p>
            </div>
          </div>
        ) : (
          ""
        )}
  
        <div className={Style.Chat_box_box}>
          <div className={Style.Chat_box}>
            <div className={Style.Chat_box_left}>
              {friendMsg.map((el, i) => (
                <div>
                  {el.sender == chatData.address ? (
                    <div className={Style.Chat_box_left_title}>
                      <Image
                        src={images.accountName}
                        alt="image"
                        width={50}
                        height={50}
                      />
                      <span>
                        {chatData.name} {""}
                        <small>Time: {convertTime(el.timestamp)}</small>
                      </span>
                    </div>
                  ) : (
                    <div className={Style.Chat_box_left_title}>
                      <Image
                        src={images.accountName}
                        alt="image"
                        width={50}
                        height={50}
                      />
                      <span>
                        {userName} {""}
                        <small>Time: {convertTime(el.timestamp)}</small>
                      </span>
                    </div>
                  )}
                  {el.msg != "" && (
                    <p key={i + 1}>
                      {el.msg}
                    </p>
                  )}
                  {el.fileHash && (  
                    <a href={`https://ipfs.io/ipfs/${el.fileHash}`} target="_blank" rel="noopener noreferrer">
                      {el.fileType && el.fileType.startsWith("image/") ? ( 
                        // Display image if it's an image type 
                        <img src={`https://ipfs.io/ipfs/${el.fileHash}`} alt="Sent image" className={Style.sentFile} />
                      ) : el.fileType && el.fileType.startsWith("video/") ? (  
                        // Display video if it's a video type  
                        <video controls className={Style.videoPlayer}>  
                          <source src={`https://ipfs.io/ipfs/${el.fileHash}`} type={el.fileType} />  
                          Your browser does not support the video tag.  
                        </video>  
                      ) : el.fileType && el.fileType.startsWith("audio/") ? (  
                        // Display audio if it's an audio type  
                        <audio controls className={Style.audioPlayer}>  
                            <source src={`https://ipfs.io/ipfs/${el.fileHash}`} type={el.fileType} />  
                            Your browser does not support the audio tag.  
                        </audio>  
                      ) : (  
                        // Display a document icon or file link for other types  
                        <div className={Style.filePreview}>  
                          <Image src={images.docIcon} alt="Document" className={Style.fileIcon} /> {/* Document icon */}  
                          <span>{el.fileName}</span> {/* Display file name */}  
                        </div>  
                      )}  
                    </a>  
                  )}
                </div>
              ))}
            </div>
          </div>
  
          {currentUserName && currentUserAddress ? (
            <div className={Style.Chat_box_send}>
              <div className={Style.Chat_box_send_img}>
                <Image src={images.smile} alt="smile" width={50} height={50} />
                <input
                  type="text"
                  placeholder="type your message"
                  onChange={(e) => setMessage(e.target.value)}
                />
                <input
                  type="file"
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,video/*,audio/*"
                  // onChange={(e) => setSelectedFile(e.target.files[0])}
                  onChange={handleFileChange}
                />
                {/* <Image src={images.file} alt="file" width={50} height={50} /> */}
                {loading == true ? (
                  <Loader />
                ) : (
                  <Image
                    src={images.send}
                    alt="file"
                    width={50}
                    height={50}
                    // onClick={() =>
                    //   functionName({ msg: message, address: chatData.address })
                    // }
                    onClick={handleSendMessage}
                  />
                )}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  };
  
  export default Chat;