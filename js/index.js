$(function () {
    var scene=$(".scene"),num;
    for(var i=0;i<5;i++){
        if(i==0){
            num=396;
        }else if(i==1){
            num=298;
        }else if(i==2){
            num=199;
        }else if(i==3){
            num=99;
        }else if(i==4){
            num=0;
        }
        var sceneSmall=$("<div>").css({
            width:"100%",
            height:100,
            perspective:8000,
            perspectiveOrigin:"center "+num+"px"
        }).appendTo(scene);
        var box=$("<div class='box'>").css({
            width:"100%",
            height:"100%",
            position:"relative",
            transformStyle:"preserve-3d",
            transition:"all 2s ease "+Math.random()+"s",
            transformOrigin:"50% 50% 400px"
        }).appendTo(sceneSmall);
        for(var j=0;j<6;j++){
            var pec=$("<div>").css({
                position:"absolute",
                left:0,
                top:0
            }).appendTo(box);
            if(j==0){
                pec.css({
                    width:800,
                    height:800,
                    transformOrigin:"top",
                    transform:"rotateX(90deg)"
            })
            }else if(j==1){
                pec.css({
                    width:800,
                    height:100,
                    transformOrigin:"left",
                    transform:"rotateY(-90deg)",
                    background:"url(./images/1.jpg) no-repeat 0 "+(-100*i)+"px"

                })
            }else if(j==2){
                pec.css({
                    width:800,
                    height:100,
                    transform:"rotateY(180deg)",
                    background:"url(./images/2.jpg) no-repeat 0 "+(-100*i)+"px"
                })
            }else if(j==3){
                pec.css({
                    width:800,
                    height:100,
                    transformOrigin:"right",
                    transform:"rotateY(90deg)",
                    background:"url(./images/3.jpg) no-repeat 0 "+(-100*i)+"px"
                })
            }else if(j==4){
                pec.css({
                    width:800,
                    height:800,
                    transformOrigin:"bottom",
                    transform:"rotateX(-90deg)",
                    top:-700
                })
            }else if(j==5){
                pec.css({
                    width:800,
                    height:100,
                    background:"url(./images/4.jpg) no-repeat 0 "+(-100*i)+"px",
                    transform:"translateZ(800px)"
                })
            }
        }
    }
    var a=0;
    setInterval(function () {
        a++;
        //if(a==6){
        //    a=0;
        //}
       $(".box").css({
           transform:"rotateY("+a*90+"deg)"
       })
    },4000)


});