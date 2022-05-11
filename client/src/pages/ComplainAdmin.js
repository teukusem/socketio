// import hook
import React, { useState, useEffect, useContext } from 'react';

import NavbarAdmin from '../components/NavbarAdmin';

import { Container, Row, Col } from 'react-bootstrap';
import Contact from '../components/complain/Contact';

// import here
import { UserContext } from '../context/userContext';
// import socket.io-client
import { io } from 'socket.io-client';
import Chat from '../components/complain/Chat';

// initial variable outside socket
let socket;
export default function ComplainAdmin() {
  const [contact, setContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  // code here
  const [messages, setMessages] = useState([]);

  const title = 'Complain admin';
  document.title = 'DumbMerch | ' + title;

  // code here
  const [state, dispatch] = useContext(UserContext);

  useEffect(() => {
    socket = io('http://localhost:5000', {
      auth: {
        token: localStorage.getItem('token'),
      },
      // code here
      query: {
        id: state.user.id,
      },
    });

    // code here
    socket.on('new message', () => {
      console.log('contact', contact);
      console.log('triggered', contact?.id);
      socket.emit('load messages', contact?.id);
    });

    // code here
    loadContacts();
    loadMessages();

    socket.on('connect_error', (err) => {
      console.error(err.message); // not authorized
    });

    return () => {
      socket.disconnect();
    };
  }, [messages]); // code here

  const loadContacts = () => {
    socket.emit('load customer contacts');
    socket.on('customer contacts', (data) => {
      // filter just customers which have sent a message
      let dataContacts = data.filter((item) => item.status !== 'admin' && (item.recipientMessage.length >= 0 || item.senderMessage.length >= 0));

      // manipulate customers to add message property with the newest message
      // code here
      dataContacts = dataContacts.map((item) => ({
        ...item,
        // message: item.senderMessage.length > 0 ? item.senderMessagge[item.senderMessage.length -1].message : "Click here to start message",
      }));
      setContacts(dataContacts);
    });
  };

  // used for active style when click contact
  const onClickContact = (data) => {
    setContact(data);
    // code here
    socket.emit('load messages', data.id);
  };

  // code here
  const loadMessages = (value) => {
    socket.on('customers contact', (data) => {
      socket.on('messages', (data) => {
        if (data.length > 0) {
          const dataMessages = data.map((item) => ({
            idSender: item.sender.id,
            message: item.message,
          }));
          console.log(dataMessages);
          setMessages(dataMessages);
        } else {
          const dataMessages = null;
          console.log('Data Messages', dataMessages);
          setMessages(dataMessages);
        }
        loadContacts();
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.scrollTop = chatMessages?.scrollHeight;
      });
    });
  };

  const onSendMessage = (e) => {
    if (e.key === 'Enter') {
      const data = {
        idRecipient: contact.id,
        message: e.target.value,
      };

      socket.emit('send messages', data);
      e.target.value = '';
    }
  };

  return (
    <>
      <NavbarAdmin title={title} />
      <Container fluid style={{ height: '89.5vh' }}>
        <Row>
          <Col md={3} style={{ height: '89.5vh' }} className="px-3 border-end border-dark overflow-auto">
            <Contact dataContact={contacts} clickContact={onClickContact} contact={contact} />
          </Col>
          {/* code here */}
          <Col md={9}>
            <Chat contact={contact} messages={messages} user={state.user} sendMessage={onSendMessage} />
          </Col>
        </Row>
      </Container>
    </>
  );
}
