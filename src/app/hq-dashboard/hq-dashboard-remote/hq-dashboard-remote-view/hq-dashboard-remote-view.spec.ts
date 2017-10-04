import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HqDashboardRemoteComponent } from './hq-dashboard-remote.component';

describe('HqDashboardRemoteComponent', () => {
  let component: HqDashboardRemoteComponent;
  let fixture: ComponentFixture<HqDashboardRemoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HqDashboardRemoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HqDashboardRemoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
