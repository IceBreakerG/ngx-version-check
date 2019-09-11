import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { VersionCheckService } from './version-check.service'
import { IVersionCheck } from 'version-check'

describe('VersionCheckService', () => {
  let sut: VersionCheckService
  let spy: any

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: []
    })

    sut = TestBed.get(VersionCheckService)
  })

  it('should be created', () => {
    const service: VersionCheckService = TestBed.get(VersionCheckService)
    expect(service).toBeTruthy()
  })

  it('should have public methods defined', () => {
    expect(sut['startVersionChecking']).toBeDefined()
    expect(sut['stopVersionChecking']).toBeDefined()
  })

  it('should have public properties defined', () => {
    expect(sut['Version']).toBeDefined()
    expect(sut['Hash']).toBeDefined()
    expect(sut['NewVersionAvailable']).toBeDefined()
  })

  it('expect interface to be defined', () => {
    let iversioncheck: IVersionCheck = {
      frequency: 10,
      notification: () => {}
    }
    expect(iversioncheck.frequency).toBeDefined()
    expect(iversioncheck.notification).toBeDefined()
  })

  it('expect startVersionChecking to be called with defaults', () => {
    spy = spyOn(sut, 'startVersionChecking')
    sut.startVersionChecking()

    expect(sut.startVersionChecking).toHaveBeenCalled()
  })

  it('expect startVersionChecking to be called with config', () => {
    spy = spyOn(sut, 'startVersionChecking')
    sut.startVersionChecking({ frequency: 30000 })

    expect(sut.startVersionChecking).toHaveBeenCalled()
  })

  it('expect stopVersionChecking to be called', () => {
    spy = spyOn(sut, 'stopVersionChecking')
    sut.stopVersionChecking()

    expect(sut.stopVersionChecking).toHaveBeenCalled()
  })
})
