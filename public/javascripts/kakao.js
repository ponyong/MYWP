Kakao.init('4089939791ab9ffa62ca848ed290f243');

function loginWithKakao() {
  // 로그인 창을 띄웁니다.
  Kakao.Auth.login({
    success: function(authObj) {
      alert(JSON.stringify(authObj));
    },
    fail: function(err) {
      alert(JSON.stringify(err));
    }
  });
};
