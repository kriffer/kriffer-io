import React from "react";
import {Container, Divider, Header, List, Image} from "semantic-ui-react";
import './about.css'
import image from './anton.jpeg'

const About: React.FC = () => {

    return (<div>
        <Container text style={{marginTop: '5em'}}>
            <Header size={'small'}>About me</Header>
            <Divider/>
            <Image src={image} size='small' floated='left'/>
            <p> Hi there, I'm Anton and I am a passionate software engineer who has been enjoying the
                computer-related stuff
                for more than 20 years.</p>
            <p> My current interests are full-stack development, operating systems, cloud native solutions and
                virtualization. In my work/experiments I leverage mostly Java and JavaScript, however, recently I have
                started looking into Rust and Go as well as I
                find them quite interesting and attractive;)</p>
            <p> As for the systems-related stuff I am keen on mostly Unix/Linux distributions since that gives unlimited
                opportunities for learning and experimenting.</p>

            <p> All the articles on this site is the result of my experiments, learning and experience. I agree that the
                posts may
                contain flaws or for some experts may seemed inconsistently (or may not seemed detailed). It's ok too.
                However,
                the goal is to have short but yet useful articles for those who look for the answers for the questions.
                Anyway, please feel free to contact me if you have any questions or notes.</p>
            <List>

                <List.Item icon='marker' content='Lappeenranta, Finland'/>
                <List.Item
                    icon='mail'
                    content={<a href='mailto:anton@kriffer.io'>anton@kriffer.io</a>}
                />
                <List.Item
                    icon='linkedin'
                    content={<a href='https://www.linkedin.com/in/antonkravets'>Linkedin</a>}
                />
                <List.Item
                    icon='twitter'
                    content={<a href='https://www.twitter.com/antonkravets'>Twitter</a>}
                />
                <List.Item
                    icon='github'
                    content={<a href='https://www.github.com/kriffer'>Github</a>}
                />
            </List>
        </Container>


    </div>)
}

export default About;