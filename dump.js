const source = `
void main() { 
  print([1,2,3]); 
  print([1,2,3].length);
  print([1,2,3][1]);
}
`;

fetch('https://stable.api.dartpad.dev/api/v3/compileDDC', {
  method: 'POST', 
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({source})
})
.then(r => r.json())
.then(r => console.log(r.result))
.catch(console.error);
