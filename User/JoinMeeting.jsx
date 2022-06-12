import ZoomMtgEmbedded from "@zoomus/websdk/dist/zoomus-websdk-embedded.umd.min";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import { get, app } from '@Panel';

const client = ZoomMtgEmbedded.createClient();

const JoinMeeting = () => {

    const [meetingNumber, setMeetingNumber] = useState('');
    const [password, setPassword] = useState('');
    const [progress, setProgress] = useState(false);

    useEffect(() => {
        let meetingSDKElement = document.getElementById('meetingSDKElement');
        client.init({
            debug: true,
            zoomAppRoot: meetingSDKElement,
            language: 'en-US',
            customize: {
                meetingInfo: ['topic', 'host', 'mn', 'pwd', 'telPwd', 'invite', 'participant', 'dc', 'enctype'],
                toolbar: {
                    buttons: [
                        {
                            text: 'Custom Button',
                            className: 'CustomButton',
                            onClick: () => {
                                console.log('custom button');
                            }
                        }
                    ]
                }
            }
        });
    }, []);

    const join = () => {
        setProgress(true);
        get(`/zoom/generateToken?meetingNumber=${meetingNumber}`).then(data => {
            console.log(data);
            setProgress(false);
            app.success('You are joining ...');
            try {
                client.join({
                    apiKey: `${process.env.REACT_APP_ZOOM_API_KEY}`,
                    signature: data.signature,
                    meetingNumber: meetingNumber,
                    password: password,
                    userName: app.user()
                })
            }
            catch (ex) {
                app.error(ex);
            }
        }, error => {
            setProgress(false);
            app.error(error);
        });
    }

    return <div>
        <div id="meetingSDKElement">

        </div>

        <TextField
            label={app.t('Meeting number')}
            helperText='Required'
            value={meetingNumber}
            onChange={(e) => setMeetingNumber(e.target.value)}
        />

        <br />
        <br />

        <TextField
            label={app.t('Password')}
            helperText='Required'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <br />
        <Button
            variant="outlined"
            onClick={() => join()}>
            {app.t('Join')}
        </Button>
    </div>
}

export default JoinMeeting;