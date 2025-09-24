const axios = require('axios');

async function testAdminLogin() {
  try {
    const response = await axios.post('http://localhost:3003/api/auth/admin-login', {
      username: 'admin',
      password: 'admin123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('响应状态:', response.status);
    console.log('响应数据:', response.data);
  } catch (error) {
    console.error('请求失败:');
    if (error.response) {
      console.error('状态码:', error.response.status);
      console.error('响应数据:', error.response.data);
      console.error('响应头:', error.response.headers);
    } else if (error.request) {
      console.error('请求信息:', error.request);
    } else {
      console.error('错误信息:', error.message);
    }
  }
}

testAdminLogin();