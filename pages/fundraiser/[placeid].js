import React, { useEffect, useState } from "react";
import Head from 'next/head';
import Link from "next/link";
import _ from 'lodash';
import { useRouter } from 'next/router'
import { useFetch } from "use-http";
import ShareIcon from '@material-ui/icons/Share';
import { useForm } from 'react-hook-form';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import FacebookIcon from '@material-ui/icons/Facebook';
import { copyUrlToClipboard, getSchoolInfo, isValidEmail, getTopDonorsBySchool } from "../../src/services/service";
import { BASE_API_URL } from "../../src/constants/api";
import { Skeleton } from "@material-ui/lab";
import { Button, Dialog, DialogContent, DialogTitle, Grid, LinearProgress, TextField } from "@material-ui/core";
import RazorpayPayment from "../../src/components/RazorpayPayment";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import PlaceSearch from "../../src/components/PlaceSearch";



export default function FundraiserPlace() {
    const httpClient = useFetch(BASE_API_URL);
    const { register, handleSubmit, getValues, formState: { errors } } = useForm();
    console.log('getValues', getValues());
    const { get, post, response, loading, error } = httpClient;
    const router = useRouter()
    const [schoolInfo, setSchoolInfo] = useState({
        schoolInfo: {
            name: 'Loading...',
            id: '',
        }
    });
    const { placeid } = router.query;
    console.log('placeid', placeid);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [amount, setAmount] = useState();
    const [raisedAmount, setRaisedAmount] = useState(0);
    const [requiredAmount, setRequiredAmount] = useState(0);
    const [progress, setProgress] = useState(0);
    const [placeInfo, setPlaceInfo] = useState(null);
    const [href, setHref] = useState(null);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [topDonors, setTopDonors] = useState([]);
    const [schoolName, setSchoolName] = useState("")
    const [schoolId, setSchoolId] = useState(placeid);

    function fetchSchoolDetails(placeid) {
        console.log('in fetchSchoolDetails')
        const pyrmont = new google.maps.LatLng(7.798, 68.14712);

        try {
            const request = {
                placeId: schoolId,
            };

            const map = new google.maps.Map(document.getElementById("map"), {
                center: pyrmont,
                zoom: 15,
            });
            const service = new google.maps.places.PlacesService(map);

            service.getDetails(request, (place, status) => {
                console.log({ status });
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    setPlaceInfo(place);
                    console.log('place-->', place);
                    setSchoolName(place.name);
                }

            });
        } catch (error) {
            console.log('fetchSchoolDetails failed', error);
        }
    }

    const getPlaceInfo = async (placeInfo) => {
        const placeAddress = _.get(placeInfo, 'formatted_address') || '';
        const placeName = _.get(placeInfo, 'name');
        const placeImage = _.get(placeInfo, 'photos[0]') && _.get(placeInfo, 'photos[0]').getUrl && _.get(placeInfo, 'photos[0]').getUrl();
        if (!placeImage) {
            placeImage = "/defaultschool.jpeg"
        }
        try {
            if (placeName && schoolId) {
                const schoolInfo = await getSchoolInfo(
                    { post, response },
                    schoolId,
                    placeName,
                    placeAddress
                );
                setSchoolInfo({ schoolInfo, placeImage })
                setProgress(parseInt(Number(schoolInfo.percentage) * 100));
                setRaisedAmount(parseInt(Number(schoolInfo.collected) / 100));
                setRequiredAmount(parseInt(Number(schoolInfo.required) / 100));
                return true;
            } else {
                console.log('sry bro', { placeAddress, placeName, schoolId });
            }
        } catch (error) {
            console.log('getPlaceInfo Error', error);
            return false;
        }
    }

    const fetchTopDonors = async (schoolId) => {
        const data = await getTopDonorsBySchool({ get, response }, schoolId)
        console.log("TOP DONORS", data)
        if (data) {

            setTopDonors(data.content)
        }
    }

    useEffect(() => {
        setHref(window.location.href);
    }, [])

    useEffect(() => {
        let { placeid } = router.query
        setSchoolId(placeid)
    }, [router])


    useEffect(() => {

        // if (!placeInfo && !placeid) {
        //     console.log('bye bye');
        //     router.push('/');
        // }
        console.log('placeInfo**', placeInfo);
        if (schoolId && !placeInfo) {
            fetchSchoolDetails(schoolId);
            fetchTopDonors(schoolId);
        }
        if (schoolId && placeInfo) {
            console.log('got the placeinfo');
            fetchTopDonors(schoolId);
            getPlaceInfo(placeInfo)
        }
        // setPlaceInfo(localStorage.getItem('placeInfo') ? JSON.parse(localStorage.getItem('placeInfo')) : null);


    }, [placeid, placeInfo, schoolId])

    useEffect(() => {
        console.log("NEW", placeid, schoolId);
        if (placeid !== schoolId) {
            placeid = schoolId;
        }
    }, [schoolId])

    return (<div className="fundraiser-wrap">
        <Head>
            <title>Vidyartha</title>
            <link rel="icon" href="/favicon.ico" />
            <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCLAaadQJ2iA8m6Nq2KGAQXwL9B6CwVvZ8&libraries=places"></script>
            <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        </Head>
        <main>
            <div className="center-align position-relative">
                    <div className="position-absolute inp-wrap">
                        {/* <TextField className="inp" label="Location" variant="outlined" />
                        <TextField className="inp" label="School" variant="outlined" /> */}
                        {/* <PlaceSearch setSchoolId={setSchoolId} setPlaceInfo={setPlaceInfo}></PlaceSearch> */}
                    </div>
                <header>
                </header>
                <Link href="/"><img className="position-absolute logo-image" height="104px" width="191px" src="/color-logo.webp" style={{ cursor: "pointer" }} /></Link>
            </div>
            <div className="fundraiser-section center-align">
                {loading ?
                    <Grid container spacing={4}>
                        <Grid item xs={6}>
                            <Skeleton variant="text" height={120} />
                            <Skeleton variant="rectangular" height={250} />
                        </Grid>
                        <Grid item xs={6}>
                            <Skeleton variant="text" height={120} />
                            <Skeleton variant="rectangular" height={250} />

                        </Grid>
                    </Grid>
                    : <Grid container spacing={4}>
                        <Grid item xs={12} sm={7} className="school-info-wrap">
                            <h2>{schoolName}</h2>
                            <img
                                src={schoolInfo.placeImage}
                                // src="https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto?1sAap_uEASRoEMZI9AimR0SHJsNyn8z08ox9ahWwly9NsFCuK4wKMsG0an-_O2q-AC7gjkvKJuUv1VtBoEFqbqTKzvfoOHY--FG1u2Nnk2OncxMvL-_1__CWLvYGyRcdfMP49EsOlAWwfTmOD_xXHwooLeK4HYpuMC8f3EJCKv5UlYiAgOK95r&3u800&5m1&2e1&callback=none&key=AIzaSyCLAaadQJ2iA8m6Nq2KGAQXwL9B6CwVvZ8&token=109081"
                                alt="Place Image unavailable"
                                width="100%"
                            // height="500"
                            ></img>
                        </Grid>
                        <Grid item xs={12} sm={5} className="collection-info-wrap">
                            <h2>placeholder</h2>
                            <div className="amount">
                                &#8377;<span className="green">{raisedAmount}</span>
                            </div>
                            <p className="raised-asof">{raisedAmount} of {requiredAmount} raised</p>
                            <div className="progress-bar-wrap position-relative">
                                <LinearProgress className="progress-bar" variant="determinate" value={progress}></LinearProgress>
                                <p className="tobe-raised position-absolute">&#8377; {requiredAmount}</p>
                            </div>
                            {/* <Button
                                className="primary-button dark m-tb-25"
                                onClick={() => {
                                    setOpenDialog(true);
                                }}
                                variant="contained"
                            >Donate Now</Button> */}
                            <div className="center-align donor-info-form pt-25">
                                <div className="form-input-wrap">
                                    <TextField
                                        id="name"
                                        label="Name"
                                        fullWidth
                                        onChange={({ target }) => setName(target.value)}
                                        variant="outlined"
                                    />
                                </div>
                                <div className="form-input-wrap">
                                    <TextField
                                        id="name"
                                        label="Email Address"
                                        fullWidth
                                        error={email && !isValidEmail(email)}
                                        onChange={({ target }) => setEmail(target.value)}
                                        variant="outlined"
                                    />
                                </div>
                                <div className="form-input-wrap">
                                    <TextField
                                        id="amount"
                                        label="Amount"
                                        onChange={({ target }) => {
                                            if (isNaN(target.value)) {
                                                alert('Please enter valid amount')
                                            } else {
                                                setAmount(target.value)
                                            }
                                        }}
                                        fullWidth
                                        variant="outlined"
                                    />
                                </div>
                                <RazorpayPayment
                                    name={name}
                                    email={email}
                                    amount={amount}
                                    httpClient={httpClient}
                                    placeId={schoolId}
                                ></RazorpayPayment>
                            </div>
                            <h4 className="sub-text">Share and Support this campaign</h4>
                            <div className="social-share-icons">
                                <ShareIcon
                                    onClick={() => {
                                        copyUrlToClipboard(href)
                                        alert('link is copied!');
                                    }}
                                />
                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${href}`} rel="noopener noreferrer" target="_blank">
                                    <FacebookIcon />
                                </a>

                                <a href={`whatsapp://send?text=Help me to Support this campaign ${href}`} data-action="share/whatsapp/share">
                                    <WhatsAppIcon className="whatsapp-icon" />
                                </a>
                            </div>

                            {/* <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                                <DialogTitle className="center-align"><h2 className="m-0">Enter your details</h2></DialogTitle>
                                <DialogContent className="center-align donor-info-form">

                                </DialogContent>
                            </Dialog> */}

                        </Grid>
                    </Grid>
                }

                <Grid container spacing={4}>
                    <Grid item xs={12} sm={7} className="about-wrap">
                        <p>About Fundraiser campaign</p>
                    </Grid>
                </Grid>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={7} className="about-wrap">
                        <div className="about">
                            <p>In order to make our students ready for a globalised world and create an opportunity for them to learn about other nations and culture, we have developed partnerships with schools around the world. The function of education is to teach one to think intensively and to think critically. In order to make our students ready for a globalised world and create an opportunity for them to learn about other nations and culture, we have developed partnerships with schools around the world. The function of education is to teach one to think intensively and to think critically.</p>
                        </div>
                    </Grid>

                    {
                        (topDonors.length > 0) && (<Grid item xs={12} sm={5}>
                            <TableContainer component={Paper}>
                                <Table className="table-wrap" aria-label="simple table">
                                    <TableHead className="thead">
                                        <TableRow className="tr">
                                            <TableCell className="th" align="center">Top Donors</TableCell>
                                            <TableCell className="th" align="center">Amount</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody className="tbody">
                                        {
                                            topDonors.map(donor =>
                                                <TableRow className="tr" key={donor.name}>
                                                    <TableCell className="td" align="left">{donor.name}</TableCell>
                                                    <TableCell className="td" align="left">{parseInt(Number(donor.amount) / 100)}</TableCell>
                                                </TableRow>
                                            )
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>)
                    }
                </Grid>
            </div>
            <div style={{ visibility: 'hidden' }} id="map"></div>

        </main>

        <footer>
            <div className="foot-wrap center-align">
                <p>
                    <Link href="/terms"><span style={{ cursor: "pointer" }}>Terms & Conditions</span></Link>
                    <Link href="/privacypolicy"><span style={{ cursor: "pointer" }}>Privacy Policy</span></Link>
                    <Link href="/returnpolicy"><span style={{ cursor: "pointer" }}>Return Policy</span></Link>
                </p>
            </div>
        </footer>
    </div>)
}
