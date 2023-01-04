const {service} = require('./routes/services.routes.js')

test('테스트가 성공하는 상황' , ()=>{
    expect(service('서비스가 아니다')).toEqual(false);
})
test('테스트가 실패하는 상황', () => {
    expect(isEmail('my-email@domain.com')).toEqual(true);
});