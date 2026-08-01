import { POST } from './src/app/api/run/route';

const source = `
void main() { 
  print([1,2,3]); 
  print([1,2,3].length);
  print([1,2,3][1]);
}
`;

POST(new Request('http://localhost', {
  method: 'POST', 
  body: JSON.stringify({source})
}))
.then(r => r.json())
.then(console.log)
.catch(console.error);
