import { DigiApi } from "./digiapi.js";

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root);
        this.load()
        DigiApi.search().then(console.log)
    }

    load () {
      this.entries = JSON.parse(localStorage.getItem('favorites')) || [];
      
      console.log(this.entries)
    }

    save () {
        localStorage.setItem('favorites', JSON.stringify(this.entries))
    }

    async add(name) {
        try{
            const userExists = this.entries.find(entry => entry.name === name)
            console.log(userExists)
            if(userExists) {
                throw new Error(`${name} already exists`)
            }
            
            const digimonList = await DigiApi.search() 
            
            const digiName = digimonList.find(digimon => digimon.name === name)
            console.log(digiName)
            if (digiName === undefined) {
                throw new Error('No digimon')
            }

            this.entries = [digiName, ...this.entries]
            this.update()
            this.save()


            
        } catch(error) {
            alert(error.message)
        }
        
    }

    delete(user) {
        const filteredEntries = this.entries
            .filter(entry => entry.name !== user.name)
            console.log(filteredEntries)
            this.entries = filteredEntries
            console.log(this.entries)
            this.update()
            this.save()
        }

    
}

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root);
        this.tbody = this.root.querySelector('table tbody');
        this.update()
        this.onadd()
    }

    onadd() {
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const {value} = this.root.querySelector('.search input')
            this.add(value)
        }
    }


    update () {
        this.removeAllTr()
        this.entries.forEach( user => {
            console.log(user)
            const row = this.CreateRow()
            row.querySelector('.digiName img').src = user.img
            row.querySelector('.digiName a').src = `https://digitalmonster.fandom.com/pt/wiki/${user.level}`
            row.querySelector('.digiName a').href = `https://digitalmonster.fandom.com/pt/wiki/${user.name}`
            row.querySelector('.digiName p').textContent = user.name
            row.querySelector('.level span').textContent = user.level 
            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('Are you sure you want to remove?')
                if (isOk) {
                    this.delete(user)
                }
            }
        
            this.tbody.append(row)    
        })
    }

    CreateRow () {
        const tr = document.createElement('tr')

        tr.innerHTML = `
        <td class="digiName">
            <img src="https://digimon.shadowsmith.com/img/koromon.jpg" alt="">
            <a href="https://digitalmonster.fandom.com/pt/wiki/Koromon" target="_blank">
                <p>Koromon</p>
            </a>
        </td>
        <td class="level">
            <span>Rookie</span>
        </td>
        <td>
            <button class="remove">&times;</button>
        </td>
        `

        return tr
    }

    removeAllTr () {
        this.tbody.querySelectorAll('tr')
        .forEach((tr) => {
            tr.remove()

        })
    }
}