package com.example.n3phele;
import org.apache.cordova.*;


import android.os.Bundle;
import android.app.Activity;
import android.content.res.Configuration;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.GradientDrawable.Orientation;

import java.awt.*;
import com.google.ads.*;

import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Menu;
import android.view.Window;
import android.widget.LinearLayout;
import android.widget.Toast;
import android.content.pm.ActivityInfo;
import java.lang.*;

public class MainActivity extends DroidGap {
	private static final String AdMob_Ad_Unit = "a151486bf0b55b1";	
	//private static int SCREEN_ORIENTATION_PORTRAIT;
	private AdView adView;		
	     
	@Override
	public void onCreate(Bundle savedInstanceState) {	
		
		super.onCreate(savedInstanceState);
		super.loadUrl("file:///android_asset/www/index.html");		
		
		/** ADmob**/
		adView = new AdView(this, AdSize.BANNER, AdMob_Ad_Unit); 
		LinearLayout layout = super.root;  
		layout.addView(adView); 
		adView.loadAd(new AdRequest());		
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.activity_main, menu);
		return true;
	}
	
	@Override
	public void onConfigurationChanged(Configuration newConfig) {                                                                                                                                                                                                                                         
	    super.onConfigurationChanged(newConfig);

	   
	    DisplayMetrics metrics = this.getResources().getDisplayMetrics();
	    int width = metrics.widthPixels;
	    int height = metrics.heightPixels;
	
	    
   
	
	    if(height<= 480){
	     
	    	setRequestedOrientation (ActivityInfo.SCREEN_ORIENTATION_PORTRAIT); 	    	
	    }
	              
	    }
	    
	    
	}






















