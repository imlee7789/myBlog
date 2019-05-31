//require node library
var express = require('express');
var fs = require('fs');

//Init libaray
var app = express();

//script folder settings : root
app.use('/script', express.static(__dirname+"/"));

//config http
var host = "localhost";
var port = 80;

//db config

app.get([
	'/',
	'/:tabid',
	'/:tabid/:navid',
	'/:tabid/:navid/:articleid',
	], function(req, res) {
	// dummy data
	var db = fs.readFileSync('./client/files/navigator/db.json', 'utf8');
	var db_json = JSON.parse(db);

	var tabs = [];
	var navs = [];
	var articles = [];
	
	//get tabs(tab list) from dbs
	db_json.forEach(function(data){
		if(data.cat==="1"){
			tabs.push(data);
		}
	});
	//get navs(nav list) from dbs
	db_json.forEach(function(data){
		if(data.cat==="2"){
			navs.push(data);
		}
	});
	//get articles(article list) from dbs
	db_json.forEach(function(data){
		if(data.cat==="3"){
			articles.push(data);
		}
	});
	
	if(req.params.tabid){
		var reqTabId = req.params.tabid;
	}else{
		var reqTabId = tabs[0].id; 
	}
	if(req.params.navid) {
		var reqNavId = req.params.navid;
	}else{
		//var reqNavId = navs[0].id;
		var reqNavId = null;
		var i=0;
		while(i<navs.length){
			if(navs[i].pid===reqTabId){
				reqNavId=navs[i].id;
				break;
			}
			i++;
		}
	}
	if(req.params.articleid) {
		var reqArticleId = req.params.articleid;
	}else{
		//var reqArticleId = articles[0].id;
		var reqArticleId = null;
		var i=0;
		while(i<articles.length){
			if(articles[i].pid===reqNavId){
				reqArticleId=articles[i].id;
				break;
			}
			i++;
		}
	}

	var tabHtml = '';
	var navHtml = '';
	
	//set tabs view
	tabs.forEach(function(tab){
		tabHtml += `<div class="blog_tab_list`;
		if (reqTabId === tab.id) {
			tabHtml += ` selected`;
		}
		tabHtml += `" onclick="location.href='http://${host}:${port}/${tab.id}'">${tab.name}</div>`;
	});
	
	//set navs, articles view
	navs.forEach(function(nav){
		if(reqTabId===nav.pid){
			navHtml += `<div class="blog_nav_list`;
			if(reqNavId===nav.id){
				navHtml += ` selected`;	
			}
			navHtml += `" onclick="location.href='http://${host}:${port}/${reqTabId}/${nav.id}'">${nav.name}</div>`;
			
			articles.forEach(function(article){
				if(article.pid===nav.id){
					navHtml += `<div class="blog_article_list`;
					if(reqArticleId===article.id){
						navHtml +=` selected`; 
					}
					navHtml += `" onclick="location.href='http://${host}:${port}/${reqTabId}/${nav.id}/${article.id}'">${article.name}</div>`;
				}
			});
		}
	});
	
	var html = `<!DOCTYPE html>
				<html>
					<head>
						<meta charset="utf-8">
				<!--		<script src="http://${host}:${port}/client/lib/ckeditor_4.11.4_standard/ckeditor/ckeditor.js"></script>	-->
						<script src="https://cdn.ckeditor.com/4.11.4/standard/ckeditor.js"></script>
						<style>
							body {
								margin:0px;
							}
							#blog_header {
								margin : 0px;
								padding : 20px;
								text-align : center;
								border-bottom : 1px gray solid;
							}
							#blog_tab {
								display : block;
								/* padding : 10px; */
								border-bottom : 1px gray solid;
							}
							.blog_tab_list {
								display : inline-block;
								padding : 10px;
								margin : 4px 0px 4px 10px;
								width : 10%;
								border : 1px gray solid;
							}
							#grid {
								display : grid;
								grid-template-columns:20% 60% 20%;
							}
							#blog_nav {
								margin : 10px;
								border-right : 1px gray solid;
							}
							.blog_nav_list {
								border : 1px gray solid;
								padding : 5px;
							}
							.blog_article_list {
								border : 1px gray solid;
								padding : 5px 5px 5px 20px;
							}
							#blog_article {
								margin : 10px;
								border : 1px gray solid;
							}
							#blog_editor {
								margin : 10px;
								border : 1px gray solid;
							}
							.selected {
								background-color:lightblue;
							}
						</style>
					</head>
					<body>
						<h1 id="blog_header">
							<a href="http://${host}:${port}">Lee heesoo's blog</a>
						</h1>
						<div id="blog_tab">
							<!-- <div class="blog_tab_list">tab</div> -->
							${tabHtml}
						</div>
						<div id="grid">
							<div id="blog_nav">
								<!-- <div class=blog_nav_list>item</div> -->
								${navHtml}
							</div>
							<div id="blog_article">
								<p style="border-bottom:1px solid gray">article</p>
								<p id="blog_article_test">
									<textarea name="editor1" id="editor1" rows="10" cols="80">This is my textarea to be replaced with CKEditor.</textarea>
								</p>
							</div>
							<div id="blog_editor">
								editor<br>
								<input type="button" id="chgmode" data-edit-mode value="mode change"></input>
							</div>
						</div>
						<script>
							var data = '';
					    	CKEDITOR.replace( 'editor1' );
					    	document.querySelector("#chgmode").addEventListener("click", function(){
					    		document.querySelector("#chgmode").dataset.editMode;
					    		if(document.querySelector("#chgmode").hasAttribute("data-edit-mode")){
					    			document.querySelector("#chgmode").removeAttribute("data-edit-mode");
					    			data = CKEDITOR.instances.editor1.getData();
					    			CKEDITOR.instances.editor1.destroy();
					    			document.querySelector("#blog_article_test").innerHTML = data;
					    		}else{
					    			document.querySelector("#chgmode").setAttribute("data-edit-mode","");
					    			document.querySelector("#blog_article_test").innerHTML = '<textarea name="editor1" id="editor1" rows="10" cols="80">This is my textarea to be replaced with CKEditor.</textarea>';
					    			CKEDITOR.replace( 'editor1' );
					    			CKEDITOR.instances.editor1.setData(data);
					    		}
								
					    	});
					    </script>
					</body>
				</html>`;
	res.send(html);
});
app.listen(port, function() {
	console.log('listen port :',port);
});