import { Button, TextField } from "@material-ui/core";
import { ArrowForwardIos } from '@material-ui/icons';

export default function Popup() {
    return (<div className="main">
        
        {/* <h1 className="heading">HELP IN CREATING A</h1>

        <h1 className="heading1">BRIGHTER FUTURE</h1>
        <h2 className="heading2">BY DONATING SPRITUAL BOOKS TO THE CHILDREN</h2>
        <hr className="line"></hr>
        <h3 className="data">Reading spritual books helps in developing personality,
            <br></br>
            builds self esteem, increases moral values, concerntration,
            <br></br>knowledge and peace</h3>
        <div><Button
            className="primary-button"
            onClick={() => {
                if (finalPlace) {
                    router.push(`/fundraiser/${finalPlace.place_id}`);
                } else {
                    alert('Please Select the school')
                }
            }}
            variant="contained"
            endIcon={<ArrowForwardIos />}
        >Donate Now</Button></div> */}

        <div className="center-align">
            <h1>HELP IN CREATING A BRIGHTER FUTURE</h1>
            <h3>BY DONATING SPIRITUAL BOOKS TO THE CHILDREN</h3>
            <hr />
            <p>Reading spiritual books helps in developing personality, builds self esteem, increases moral values, concentration, knowledge and peace</p>
            <Button className="btn1" variant="contained">
                <p>Submit</p>
            </Button>
        </div>
        <div><img className="image" src="image1.png"></img></div>
        <div className="logo"><img src="logo-white.png"></img></div>
        
    </div>)
}
