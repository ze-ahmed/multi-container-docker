import React, {Component} from 'react'
import axios from 'axios'


class Fib extends Component {
    state = {
        seenIndexes: [],
        values: {},
        index: ''

    };

    componentDidMount () {
        this.fetchValues();
        this.fetchIndexes();
    };

    async fetchValues() {
        const values = await axios.get('/api/values/current');

        this.setState({
            values: values.data
        });
        console.log('fetchValues => values.data', values);
    };


    async fetchIndexes(){
        const indexes = await axios.get('api/values/all');
        this.setState({
            seenIndexes: indexes.data
        })
        console.log('fetchIndexes => indexes ', indexes);
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        await axios.post('/api/values', {
            index: this.state.index,
        });

        this.setState({

            index: ''
        });
    }

    renderSeenIndexes() {
        console.log('renderSeenIndexes => seenIndexes', this.state.seenIndexes);
        return this.state.seenIndexes.map(({ number }) => number).join(', ');
    }

    renderValues(){
        console.log(this.state.values);
        const entries = [];

        for(let key in this.state.values){
            console.log('renderValues ', this.state.values)
            entries.push(
                <div ket={key}>
                    For index {key} I've calculated {this.state.values[key]}
                </div>
            )
        }

        return entries;
    }


    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>Input your index</label>
                    <input values={this.state.index} onChange={event =>  this.setState({ index: event.target.value})}  />
                    <button>Submit</button>
                </form>
                
                <h3>Indexes I have seen:</h3>
                {this.renderSeenIndexes()}

                <h3>Calculated values</h3>
                {this.renderValues()}
            </div>
            )
    }

}

export default Fib;
