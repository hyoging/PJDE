
//사진 선택 기능
function colorChange(){
    // var color = document.getElementById("selectColor").value;
    // document.getElementById("div1").style.backgroundColor = color;

    var color = document.getElementById("selectColor");
    var div = document.getElementById("pj");

    console.log(selectColor);
    console.log(selectColor.value);

    div.style.backgroundColor = selectColor.value;
}

//멤버 추가, 삭제 기능
var arrInput = new Array(0);
var arrInputValue = new Array(0);

function addInput() {
arrInput.push(arrInput.length);
arrInputValue.push("");
display();
}

function display() {
document.getElementById('parah').innerHTML="";
for (intI=0;intI<arrInput.length;intI++) {
  document.getElementById('parah').innerHTML+=createInput(arrInput[intI], arrInputValue[intI]);
}
}

function saveValue(intId,strValue) {
arrInputValue[intId]=strValue;
}  

function createInput(id,value) {
return "<input type='text' id='text "+ id +"' onChange='javascript:saveValue("+ id +",this.value)' value='"+ value +"'placeholder='멤버 이름'><br>";
}

function deleteInput() {
if (arrInput.length > 0) { 
   arrInput.pop(); 
   arrInputValue.pop();
}
display(); 
}

// function createDiv() {
//     // 1. <div> element 만들기
//     const newDiv = document.createElement('div');
    
//     // 2. <div>에 들어갈 text node 만들기
//     const newText = document.createTextNode('안녕하세요');
    
//     // 3. <div>에 text node 붙이기
//     newDiv.appendChild(newText);
    
//     // 4. <body>에 1에서 만든 <div> element 붙이기
//     document.body.appendChild(newDiv);
//   } 