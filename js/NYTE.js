class Input extends React.Component {
    constructor(props) {
        super(props);
        this.state = { date: [] };

        this.setMonth = this.setMonth.bind(this);
        // this.setYear = this.setYear.bind(this);
    }

    searchByMY() {
        const date = this.state.date;
        this.props.fetchArticles(date);
    }

    setMonth(e) {
        let date = e.target.value.split("-");
        date = date.map(date => Math.abs(date)).join("/");
        console.log(date);
        this.setState({ date: date });
    }

    // setYear(e){
    //     this.setState({year: e.target.value})
    // }

    render() {
        return (
            <div className="input">
                <a href="http://developer.nytimes.com">
                    <img
                        src="https://static01.nytimes.com/packages/images/developer/logos/poweredby_nytimes_30b.png"
                        id="ny-api-logo"
                    />
                </a>
                <h2>News archive</h2>
                <div id="search-box">
                    <label htmlFor="month">Search by year & month:</label>
                    <input
                        type="month"
                        id="month"
                        name="month"
                        min="1981-01"
                        max="2018-03"
                        onChange={e => this.setMonth(e)}
                    />

                    {/*<span>Search year:</span>*/}
                    {/* <input type="year" id="year" onChange={e => this.setYear(e)}> */}

                    <input
                        type="button"
                        id="find"
                        value="Find"
                        onClick={this.searchByMY.bind(this)}
                    />
                </div>
            </div>
        );
    }
}

class ShowResult extends React.Component {
    constructor(props) {
        super(props);
        this.setResult = this.setResult.bind(this);
        //this.showDetail = this.showDetail.bind(this);
        this.callLinkPreview = this.callLinkPreview.bind(this);

        this.state = {
            description: "",
            image: "",
            title: "",
            url: "",
            clickedArt: "" // drzace kliknuti clanak
        };
    }

    setResult(result) {
        this.setState({
            description: result.description,
            image: result.image,
            title: result.title,
            url: result.url
        });
    }

    callLinkPreview() {
        $.ajax({
            //url: `http://api.linkpreview.net/?key=123456&q=https://www.google.com`,
            url: `https://api.linkpreview.net/?key=5a9168704988539b8faaf928ad46f59df7c4ca9ae0dce&q=${
                this.props.url
            }`,
            method: "GET"
        })
            .done(result => {
                this.setResult(result);
            })
            .fail(function(err) {
                throw err;
            });
    }

    componentDidMount() {
        this.callLinkPreview();
    }

    componentDidUpdate(prevProps, preState) {
        if (prevProps.url !== this.props.url) {
            this.callLinkPreview();
        }
    }

    render() {
        const placeholder =
            this.state.image ===
            "https://static01.nyt.com/images/icons/t_logo_291_black.png"
                ? "img/placeholder.jpg"
                : this.state.image;
        return (
            <div className="article">
                <img className="img" src={placeholder} />
                <h3 className="title">{this.state.title}</h3>
                <p className="description">{this.state.description}</p>
                <a className="link" href={this.state.url}>
                    Read more...
                </a>
            </div>
        );
    }
}

class ShowDetail extends React.Component {
    render() {
        console.log("show");

        return <div>oks</div>;
    }
}

class Result extends React.Component {
    constructor(props) {
        super(props);
        this.state = { articles: [] };
        this.fetchArticles = this.fetchArticles.bind(this);
    }

    fetchArticles(date) {
        var url = `https://api.nytimes.com/svc/archive/v1/${date}.json`;
        url +=
            "?" +
            $.param({
                "api-key": "32e84cd913b6451bb47730dea03e2515"
            });
        console.log(url);
        $.ajax({
            url: url,
            method: "GET"
        })
            .done(result => {
                let items = [];
                for (var i = 0; i < 20; i++) {
                    const item = result.response.docs[i];
                    items.push(item.web_url);
                }
                this.setState({
                    articles: items
                });
                console.log(this.state);
            })
            .fail(function(err) {
                throw err;
            });
    }

    render() {
        return (
            <div>
                <header>
                    <h1 id="h1img">
                        <img id="imglogo" src="img/logo.png" />
                    </h1>
                </header>
                <Input fetchArticles={this.fetchArticles} />
                <div className="showResult">
                    {this.state.articles.map((url, index) => (
                        <ShowResult key={index} url={url} />
                    ))}
                </div>
            </div>
        );
    }
}

const root = document.getElementById("root");
ReactDOM.render(<Result />, root);
