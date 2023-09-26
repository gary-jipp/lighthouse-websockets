const Chat = function(props) {

  return (
    <>
      <h2>Messages</h2>
      <button type="button" onClick={props.logout}>Logout</button>
    </>
  );
};

export default Chat;