const Chat = function(props) {

  return (
    <>
      <h2>Web Chat Page</h2>
      <button type="button" onClick={props.logout}>Logout</button>
    </>
  );
};

export default Chat;