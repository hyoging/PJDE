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


// 이미지 추가 기능
  $(document).ready(function(){
 var fileTarget = $('.filebox .upload-hidden');

  fileTarget.on('change', function(){
      if(window.FileReader){
          // 파일명 추출
          var filename = $(this)[0].files[0].name;
      } 

      else {
          // Old IE 파일명 추출
          var filename = $(this).val().split('/').pop().split('\\').pop();
      };

      $(this).siblings('.upload-name').val(filename);
  });

  //preview image 
  var imgTarget = $('.preview-image .upload-hidden');

  imgTarget.on('change', function(){
      var parent = $(this).parent();
      parent.children('.upload-display').remove();

      if(window.FileReader){
          //image 파일만
          if (!$(this)[0].files[0].type.match(/image\//)) return;
          
          var reader = new FileReader();
          reader.onload = function(e){
              var src = e.target.result;
              parent.prepend('<div class="upload-display"><div class="upload-thumb-wrap"><img src="'+src+'" class="upload-thumb"></div></div>');
          }
          reader.readAsDataURL($(this)[0].files[0]);
      }

      else {
          $(this)[0].select();
          $(this)[0].blur();
          var imgSrc = document.selection.createRange().text;
          parent.prepend('<div class="upload-display"><div class="upload-thumb-wrap"><img class="upload-thumb"></div></div>');

          var img = $(this).siblings('.upload-display').find('img');
          img[0].style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enable='true',sizingMethod='scale',src=\""+imgSrc+"\")";        
      }
  });
});