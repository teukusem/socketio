
import Chat from '../components/complain/Chat';
import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import Navbar from '../components/Navbar';

// import components here
import Contact from '../components/complain/Contact';

// import socket.io-client
import { io } from 'socket.io-client';
import { UserContext } from '../context/userContext';

// initial variable outside component
let socket;
export default function Complain() {
  // code here
  const [contact, setContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [state] = useContext(UserContext);

  const title = 'Complain';
  document.title = 'DumbMerch | ' + title;

  // code here

  const loadContact = () => {
    // emit event load admin contact
    socket.emit('load admin contact');
    // listen event to get admin contact

    socket.on('admin contact', async (data) => {
      const dataContact = {
        ...data,
        message: messages.length > 0 ? messages[messages.length - 1].message : 'Click here to start message',
      };
      setContacts([dataContact]);
    });
  };

  const onClickContact = (data) => {
    setContact(data);
    socket.emit('load messages', data.id);
  };

  const loadMessages = (value) => {
    socket.on('admin contact', (data) => {
      socket.on('messages', async (data) => {
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

  useEffect(() => {
    socket = io('http://localhost:5000', {
      auth: {
        token: localStorage.getItem('token'), // we must set options to get access to socket server
      },
      query: {
        id: state.user.id,
      },
    });

    socket.on('new message', () => {
      console.log('contact', contact);
      console.log('triggered', contact?.id);
      socket.emit('load messages', contact?.id);
    });

    // code here

    socket.on('connect_error', (err) => {
      console.error(err.message); // not authorized
    });

    loadContact();
    loadMessages();

    return () => {
      socket.disconnect();
    };
  }, [messages]);

  return (
    <>
      <Navbar title={title} />
      <Container fluid style={{ height: '89.5vh' }}>
        <Row>
          <Col md={3} style={{ height: '89.5vh' }} className="px-3 border-end border-dark overflow-auto">
            <Contact dataContact={contacts} clickContact={onClickContact} contact={contact} />
          </Col>
          {/* code here */}
          <Col md={9} style={{ maxHeight: '89.5vh' }} className="px-0">
            <Chat contact={contact} messages={messages} user={state.user} sendMessage={onSendMessage} />
          </Col>
        </Row>
      </Container>
    </>
  );
}
