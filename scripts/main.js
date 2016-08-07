/**
 * Created by vimalkumar on 7/29/2016.
 */

var Uniq_UserName=(function ($,_) {

    var baseUrl="http://chegg-tutors.appspot.com";

    // verify user Exisit or not
    //@input - [usernames] array of user names
    var verifyUsersExist=function (usernames){

        //Verify user name exists or not
        return $.ajax( baseUrl+"/coding-challenge/api/user/?username="+usernames.join(',')).then(function(data) {

            if(data) {
                //Identify user name which doesn't exist on server
                for(var iCount=0;iCount<data.length;iCount++){
                    var index= usernames.indexOf(data[iCount].username);
                    if(index!=-1){
                        usernames.splice(index,1)
                    }
                }
                // return valid user name which are available
                return usernames;
            }
            else {

                return null;
            }
        });
    }

    // generate unique usernmae based on user input
    //@userInputUserName
    var generateUserNameSuggestion=function (userInputUserName){
        //Suggest Name based on Current date Time
        // Suggest Name based on Tutor synonyms
        // Suggest Name based on student synonym

        //identity all charated from user input
        var alphaOnly= userInputUserName.replace(/\d/g,'');  // remove all number

        //if only non alphanumeric chracter
        if(alphaOnly == ""){
            alphaOnly=userInputUserName
        }

        var tutorSynonym = ["educator","mentor","prof","teach","coach","lecturer"];
        var studentSynonym=["grad","junior","learner","undergrad"];
        //generate unique user name based on synonym
        var suggestUserNameBasedOnTutor= _.map(tutorSynonym ,function(tutor){
            return [alphaOnly+"-"+tutor,tutor+"_"+alphaOnly];
        })
        suggestUserNameBasedOnTutor=_.flatten(_.map(suggestUserNameBasedOnTutor, _.values))

        var suggestUserNameBasedOnTutor_2=_.map(tutorSynonym ,function(tutor){
            return [userInputUserName+"_"+tutor,tutor+"_"+userInputUserName];
        })
        suggestUserNameBasedOnTutor_2=_.flatten(_.map(suggestUserNameBasedOnTutor_2, _.values))

        var suggestUserNameBasedOnStudent= _.map(studentSynonym ,function(student){
            return [alphaOnly+"-"+student,student+"_"+alphaOnly];
        })
        suggestUserNameBasedOnStudent= _.flatten(_.map(suggestUserNameBasedOnStudent,_.values))

        var suggestUserNameBasedOnStudent_2=_.map(studentSynonym ,function(tutor){
            return userInputUserName+"-"+tutor;
        })

        var date = new Date();
        //return unique set of suggested user name
        return _.uniq( suggestUserNameBasedOnTutor.concat(suggestUserNameBasedOnStudent,
            [alphaOnly +date.getFullYear(),alphaOnly+(date.getDay()+1) ,alphaOnly+Math.floor(Math.random()*100) ],
            suggestUserNameBasedOnStudent_2,suggestUserNameBasedOnTutor_2 ));
    }

    var init= function(){
        $(document).ready(function(){

            // validate user name on button click
            $("#chg-balloon-submit").click(identifyUserName);

            //validate user name on press of enter
            $('#chg-balloon-input').keypress(function (e) {
                var key = e.which;
                if(key == 13)  // the enter key code
                {
                    identifyUserName();
                    return false;
                }
            });
        });
    }

    var identifyUserName= function() {
        //fetch the user input value
        var chg_UserName=$("#chg-balloon-input").val();

        //if value is empty and alphanumeric
        if(chg_UserName && isAlphanumeric(chg_UserName)) {
            //generate the random user name based on user input
            var userNameSuggestion = [chg_UserName].concat(generateUserNameSuggestion(chg_UserName));
            //verify the valid user name
            $.when(verifyUsersExist(userNameSuggestion)).then(function (data) {
                // data: valid available user name

                //data:result contain the user input means user name typed by user is available
                if( data.indexOf(chg_UserName)!=-1){
                    //valid
                    $("#chg-input-success").show();
                    $("#chg-input-invalid").hide();
                    $("#chg-username-Suggestion").hide();
                }
                else{
                    //not valid
                    //provide suggestion

                    // Empty the username suggestion list
                    $("#chg-username-list").empty();

                    //provide 3 suggestion
                    for(var icount=0;icount<data.length && icount<3 ;icount++) {
                        // bind suggested the user name atleast 3
                        $("#chg-username-list").append("<li>"+data[icount]+"</li>")
                    }

                    //Show suggestion to user
                    $("#chg-username-Suggestion").show();
                    $("#chg-input-success").hide();
                    $("#chg-input-invalid").show();
                }
                //console.log(data);
            });
        }
        else{
            $("#chg-username-Suggestion").hide();
            $("#chg-input-success").hide();
            $("#chg-input-invalid").hide();
        }
    }

    var isAlphanumeric=function(userInput)
    {
        var letterNumber = /^[0-9a-zA-Z]+$/;
        if(letterNumber.test(userInput) && userInput.length >=3  )
        {
        //&& /\d/.test(userInput) && /[a-zA-Z]/.test(userInput)
            $(".chg-validation-msg").hide()
            return true;
        }
        else
        {
            $(".chg-validation-msg").show()
            return false;
        }
    }
    return{
        init:init()
    }

})($,_);



