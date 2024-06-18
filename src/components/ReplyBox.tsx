const ReplyBox = ({replying_to}: {replying_to: number}) => {
  return (
    <div className="reply-box">
      <textarea placeholder="Write your reply here..." />
      <button>Reply</button>
    </div>
  );
};

export default ReplyBox;
