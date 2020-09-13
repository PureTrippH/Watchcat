exports.run = async (client, message, args) => {
    const fetch = require("node-fetch");
    const Discord = require('discord.js');
    const Canvas = require('canvas');
    const board = require("../commands/jeopardy/board.js");
    const serverStats = require("../utils/schemas/serverstat");
    const Trivia = new Discord.MessageEmbed();
    const TriviaWrong = new Discord.MessageEmbed();
    if(args[0]) {
    switch(args[0].toLowerCase()) {
		case "board":
			board.run(client, message, args);
		break;
    }
    return;
}
    const questioncanvas = Canvas.createCanvas(500, 200, 
        {
        legend: {
			itemMaxWidth: 150,
			itemWrap: true
        }});
    const ctx = questioncanvas.getContext("2d");
    const background = await Canvas.loadImage("https://wallpaperaccess.com/full/635988.png");
    ctx.drawImage(background, 0, 0, questioncanvas.width, questioncanvas.height)
    let startfont = 60;
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle= "black"
    ctx.lineWidth = 1;
    ctx.textAlign = "center";     
    await fetch(`https://jservice.io/api/random`)
    .then(response => response.json())
    .then(data => {
    
    
    do{
        startfont--;
        ctx.font=startfont+"px Arial";
    }while(ctx.measureText(data[0].category.title).width>questioncanvas.width)
    ctx.strokeText(data[0].category.title, 250, 50);


    let count = 0;
    let newlineString = "";
    let spacing = 0;
    for(let char of (data[0].question)) {
        count++
        if(count >= 49 && char == ' ') {
            ctx.font = "20px Arial";
            ctx.strokeText(newlineString, 250, 100 + spacing);
            count = 0
            spacing += 20;
            newlineString = ""
            newlineString += char
        } else {
            newlineString += char
        }
    };
    console.log(newlineString);
    if(count <= 49 || count >= 49) {
        console.log("yeah it runs this");
        spacing += 20;
        ctx.font = "20px Arial";
            ctx.strokeText(newlineString, 250, 100 + spacing);
    }




    const exportImage = new Discord.MessageAttachment(questioncanvas.toBuffer(), "triviaquestion.png");
    Trivia.setColor('#e3bcf7');
    
    Trivia.setFooter('Trivia');
    Trivia.setTimestamp();
    Trivia.attachFiles(exportImage)
    Trivia.setImage('attachment://triviaquestion.png');
    Trivia.setAuthor(`Laelas Watchcat Trivia`, 'https://toppng.com/uploads/preview/laying-transparent-background-cute-cat-11562956598s3fxbbhxme.png')
    Trivia.setThumbnail('https://media1.giphy.com/media/fvZXWw0soflWv74Pjs/giphy.gif');
      message.channel.send(Trivia);
      message.channel.awaitMessages(m => m.author.id === message.author.id, {
        max: 1,
        time: 15000
    }).then(collectedtext => {
        message.delete();
        let newAnswer = (data[0].answer).replace("<i>", "").replace("</i>", "")
        if((collectedtext.first().content).toLowerCase() == (newAnswer).toLowerCase()) {
            serverStats.findOneAndUpdate({
                guildId: message.guild.id, 
                "guildMembers.userID": message.author.id
              },
              {
                $inc:{
                  "guildMembers.$.triviaCorrect":1
                }
              },
               {upsert: true}).exec();
        
               TriviaWrong.setColor('#c1cf9b');
    
               TriviaWrong.setFooter('Trivia');
               TriviaWrong.setTimestamp();
               TriviaWrong.setImage('https://media1.tenor.com/images/b216cedb53e09ac92f8053e504e2be76/tenor.gif?itemid=3554892');
               TriviaWrong.setAuthor(`CORRECT!`, 'https://media1.giphy.com/media/QBSi1K0yOp1WDGyUFZ/giphy.gif')
               message.channel.send(TriviaWrong).then(msg =>{
                   msg.delete({timeout: 4000});
               });
        
        
            } else {
            TriviaWrong.setColor('#eb8c59');
    
            TriviaWrong.setFooter('Trivia');
            TriviaWrong.setTimestamp();
            TriviaWrong.setImage('https://media1.tenor.com/images/b216cedb53e09ac92f8053e504e2be76/tenor.gif?itemid=3554892');
            TriviaWrong.setAuthor(`INCORRECT!: Correct Answer: ${newAnswer}`, 'https://toppng.com/uploads/preview/laying-transparent-background-cute-cat-11562956598s3fxbbhxme.png')
            message.channel.send(TriviaWrong).then(msg =>{
                msg.delete({timeout: 8000});
            });
        } 
    })
    .catch(collected => {
            let newAnswer = (data[0].answer).replace("<i>", "").replace("</i>", "")
            TriviaWrong.setColor('#eb8c59');
    
            TriviaWrong.setFooter('Trivia');
            TriviaWrong.setTimestamp();
            TriviaWrong.setImage('https://media1.tenor.com/images/b216cedb53e09ac92f8053e504e2be76/tenor.gif?itemid=3554892');
            TriviaWrong.setAuthor(`TIME OUT!: Correct Answer: ${newAnswer}`, 'https://toppng.com/uploads/preview/laying-transparent-background-cute-cat-11562956598s3fxbbhxme.png')
            message.channel.send(TriviaWrong).then(msg =>{
                msg.delete({timeout: 8000});
            });
    });
    });

}


module.exports.help = {
    name: "Trivia",
    type: "fun",
	desc: "View a Trivia question an Answer it.",
	usage: "!!trivia"
}

